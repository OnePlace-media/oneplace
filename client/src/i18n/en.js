module.exports = {
  errors: {
    UNKNOW_ERROR: 'Something wrong',
    STEEMIT_MAX_VOTE_CHANGES: 'Voter has used the maximum number of vote changes on this comment',
    STEEMIT_MIN_VOTE_INTERVAL_SEC: 'Can only vote once every 3 seconds'
  },
  common: {
    reply: 'Reply',
    back: 'back',
    tags: 'Tags',
    author: 'Author',
    returnToOnePlace: 'Return to OnePlace',
    validate: {
      emailRequired: 'E-mail address can\'t be blank',
      emailFormat: 'Please enter a valid E-mail address. Example: username@domain.com',
      emailUniqueness: 'This email address has already been registered',
      passwordRequired: 'Password address can\'t be blank',
      passwordRepeat: 'Password doesn\'t match',
      emailVerified: 'E-mail hasn\'t been verified',
      emailNotFound: 'E-mail not found',
      activeKeyRequired: 'Active key can\'t be blank',
      activeKeyNotPassed: 'Active key not passed',
      usernameRequired: 'Username can\'t be blank',
      usernameNotFound: 'Account with this username not found',
      tagRequired: 'Tag key can\'t be blank',
      tagFormat: 'Use only letters, digits and one dash',
      tagLimited: 'Tag limit reached',
      tagMax: 'Max length 64',
      firstIsLetter: 'Must begin with a letter',
      lastIsLetterOrDigit: 'Must end with a letter or a digit',
    },
    timeAgoWithAuthor: '{timeago} by {author}',
    headers: {
      recentPosts: 'Recent posts'
    },
    placeholders: {
      email: 'E-mail',
      password: 'Password',
      passwordRepeat: 'Repeat password',
      username: 'Username',
      addAccountUsername: '{blockchain} username',
      addAccountActiveKey: '{blockchain} active key (private)',
      activeKey: 'Active key',
      leaveAComment: 'Leave a comment...'
    }
  },
  comment: {
    header: 'Comments',
    post: 'Post',
    cancel: 'Cancel',
    preview: 'Preview',
    dislike: 'Dislike',
    like: 'Like',
    removeVote: 'Remove vote'
  },
  addAccount: {
    header: 'It\'s time to add your {blockchain} account!',
    help: 'Please enter required information in the form below. You can later add more accounts in your profile.',
    backToOnePlace: 'Back to OnePlace'
  },
  chains: {
    imageIsHidden: 'Image is hidden',
    emptyCategoryHelp: 'No posts in this category.',
    removeFlag: 'Remove flag',
    downvotePost: 'Downvote post'
  },
  welcome: {
    chooseChainStep: {
      help: 'Please attach Steem or Golos account. You can later add more accounts in your profile'
    },
    attachChainStep: {
      header: 'Thank you for registration!',
      help: 'Please attach Steem or Golos account. You can later add more accounts in your profile.',
      addBlockchainAccount: 'Add blockchain account',
      addBlockchainAccountReplace: 'Add {blockchain} account',
      skipThisStep: 'Skip this step',
      back: 'Back to choose blockchain'
    },
    setupTagsStep: {
      header: 'Please choose topics you\'re interested in',
      startYourJourney: 'Start your journey'
    }
  },
  tagsForm: {
    approve: 'Approve',
    clearAllChainTags: 'Clear all {blockchain} tags',
    addTags: 'Add tags',
    addTagsWithChain: 'Add {blockchain} tags',
    upTo20: 'Up to 20',
    help: 'Add a topic by typing in the field above or by clicking on one of the popular tags. Tags are displayed in the same order in your feed.',
    helpSettings: 'Add a topic by typing in the field above and pressing "enter". Tags will be displayed in the same order in your feed.'
  },
  accountForm: {
    removeAccount: 'Remove account',
    addAccount: 'Add account',
    cancelRemoveAccount: 'Cancel',
    backToSelectBlockchain: 'Back to select blockchain',
    aboutPrivate: '<em>OnePlace does not store your private keys</em>. Once you sign in with your blockchain account you authorize OnePlace app to vote, post and edit comments on your behalf. You can revoke that authority at any time.',
    aboutRemove: '<em>Remove account</em>. You are going to remove posting authority from oneplace.app. Confirm this operation with your private active key.',
  },
  topBar: {
    addAccount: 'Add account',
    getStarted: 'Get Started',
    settings: 'Settings',
    switchAccount: 'Switch account',
    logout: 'Logout'
  },
  footer: {
    createdBy: 'Created in 2017 by {link}',
    language: 'Language'
  },
  settings: {
    header: 'Profile settings',
    blockchainAccounts: 'Pinned blockchain accounts',
    addBlockChainAccount: 'Please attach your Steem or Golos account',
    categoriesList: 'Categories for reading',
    noAddedAccountsYet: 'No added accounts yet'
  },
  auth: {
    SignIn: 'Log in',
    ResetPassword: 'Reset password',
    CreateAccount: 'Create profile',
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
    }
  }
}