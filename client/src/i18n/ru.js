module.exports = {
  common: {
    timeAgoWithAuthor:'{timeago} от {author}',
    headers:{
      recentPosts:'Недавние посты'
    },
    placeholders: {
      email: 'E-mail',
      password: 'Пароль',
      passwordRepeat: 'Повторить пароль '
    }
  },
  topBar:{
    addAccount:'Добавить аккаунт',
    getStarted:'Начать'
  },
  footer:{
    createdBy: 'Создан в 2017 году {link}',
    language: 'Язык'
  },
  auth: {
    SignIn: 'Вход',
    ResetPassword: 'Reset password',
    CreateAccount: 'Create account',
    ChangePassword: 'Change password',
    header: {
      signInHelp: 'Using Steem, Golos or OnePlace account',
      createAccountHelp: 'Fast registration to access all functions',
    },
    recovery: {
      header: 'Recover lost password',
      help: 'Enter your registration e-mail below and we\'ll send you a link to reset your password.',
      success: {
        header: 'Check your inbox',
        body: 'An e-mail has been sent to your address with instructions on how to reset your password.'
      }
    },
    reset: {
      header: 'Your password has been reset',
      help: 'Please enter your new password',
      success: {
        header: 'Success recovery access',
        body: 'You will be automatically redirected in 5 seconds.'
      },
      fail: {
        header: 'Failure recovery access',
        body: 'Your session has expired, you can repeat {action}.',
        action: 'the recovery procedure'
      }
    },
    login: {
      help: '<strong>Note:</strong> If you use Steem or Golos account for signing in you will not be able to access all functions. To use full functionality please create OnePlace account based on your Steem or Golos account.',
      forgot: 'Forgot your password?',
      wrongCredentials: 'The email or password you entered is incorrect'
    },
    registration: {
      success: {
        header: 'Thank you for registration!',
        body1: 'Registration email sent.',
        body2: 'To complete the registration process look for an email in your inbox that provides further instructions.',
        getIn: 'Get In'
      }
    },
    validate: {
      emailRequired: 'E-mail address can\'t be blank',
      emailFormat: 'Please enter a valid E-mail address. Example: username@domain.com',
      emailUniqueness: 'This email address has already been registered',
      passwordRequired: 'Password address can\'t be blank',
      passwordRepeat: 'Password doesn\'t match',
      emailVerified: 'E-mail hasn\'t been verified',
      emailNotFound: 'E-mail not found'
    }
  }
}