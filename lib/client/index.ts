import { TwitterOpenApi, TwitterOpenApiClient } from 'twitter-openapi-typescript'

export class Client {
  private _authToken: string
  private _credentials: string[] | null = null
  private _client: TwitterOpenApiClient | null = null

  constructor(authToken: string) {
    this._authToken = authToken
  }

  connect = async () => {
    if (this._client) {
      return this._client
    }

    if (!this._credentials) {
      await this.getCredentials()
    }

    if (!this._credentials) {
      throw new Error('Failed to get credentials')
    }

    const cookie: Record<string, string> = {}

    this._credentials.forEach(c => {
      const [key, value] = c.split('=')
      cookie[key] = value
    })


    const api = new TwitterOpenApi()
    const client = await api.getClientFromCookies({ ...cookie, auth_token: this._authToken })

    this._client = client

    return client
  }

  getCredentials = async () => {

    if (this._credentials) {
      return this._credentials
    }

    if (!this._authToken) {
      throw new Error('Missing auth token')
    }

    const headers = await fetch('https://x.com/manifest.json', {
      method: "GET",
      headers: {
        cookie: `auth_token=${this._authToken}`,
      },
      credentials: 'include'
    })
      .then(res => res.headers)
      .catch(err => console.error(err))

    if (!headers) {
      throw new Error('Failed to get credentials')
    }

    const cookies = headers.getSetCookie()

    if (!cookies) {
      throw new Error('Failed to get credentials')
    }

    this._credentials = cookies.map(c => c.split('; ')).flat()
  }
}

export const client = new Client(process.env.AUTH_TOKEN!)
