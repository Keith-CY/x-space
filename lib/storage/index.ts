import admin from 'firebase-admin'

const FIREBASE_AUTH = process.env.FIREBASE_AUTH
const FIREBASE_REALTIME_DATABSE = process.env.FIREBASE_REALTIME_DATABSE

class Firebase {
  private _db: admin.database.Database
  private _refPath = 'tweets'


  constructor() {

    if (!FIREBASE_AUTH) {
      throw new Error('FIREBASE_AUTH not found')
    }

    if (!FIREBASE_REALTIME_DATABSE) {
      throw new Error('FIREBASE_REALTIME_DATABSE not found')
    }

    const credential = JSON.parse(FIREBASE_AUTH)
    admin.initializeApp({
      credential: admin.credential.cert(credential),
      databaseURL: FIREBASE_REALTIME_DATABSE
    })
    this._db = admin.database()
  }

  addTweet = async (id: string, attrs: Record<string, string>) => {
    return await this._db.ref(`${this._refPath}/${id}`).set({
      like: 0,
      dislike: 0,
      ...attrs,
    })
  }

  likeTweet = async (id: string) => {
    return await this._db.ref(`${this._refPath}/${id}/like`).transaction((current) => {
      return current + 1
    })
  }

  dislikeTweet = async (id: string) => {
    return await this._db.ref(`${this._refPath}/${id}/dislike`).transaction((current) => {
      return current + 1
    })
  }

  getTweets = async () => {
    const snapshots = await this._db.ref(this._refPath).once('value')
    return snapshots.val()
  }
}

export default new Firebase()
