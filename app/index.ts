import syncUserTweets from '@/lib/jobs/user-tweets'
import db from '@/lib/storage'
import './cron'

class App {

  async sync() {
    return await syncUserTweets()
  }

  async getTweets() {
    return db.getTweets()
  }

  async likeTweet(id: string) {
    return db.likeTweet(id)
  }

  async dislikeTweet(id: string) {
    return db.dislikeTweet(id)
  }
}

export default new App()
