import testEmailConfiguration from './utils/testEmail.js'

console.log('🚀 Starting email configuration test...')

testEmailConfiguration()
    .then((success) => {
        if (success) {
            console.log('✅ Email system is working correctly!')
            process.exit(0)
        } else {
            console.log('❌ Email system has issues')
            process.exit(1)
        }
    })
    .catch((error) => {
        console.error('💥 Test failed with error:', error.message)
        process.exit(1)
    })