import cron from 'node-cron'
import sync from '@/lib/jobs/user-tweets'

cron.schedule('* */3 * * *', () => {
  console.info('Running sync job')
  sync()
})
