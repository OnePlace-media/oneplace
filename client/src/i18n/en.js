module.exports = {
  errors: {
    UNKNOW_ERROR: 'Something is wrong.',
    STEEMIT_MAX_VOTE_CHANGES: 'You have used the maximum number of vote changes on this comment',
    STEEMIT_MIN_VOTE_INTERVAL_SEC: 'You can only vote once every 3 seconds'
  },
  common: {
    in: 'in',
    reply: 'Reply',
    back: 'Back',
    tags: 'Tags',
    author: 'Author',
    returnToOnePlace: 'Return to OnePlace',
    validate: {
      emailRequired: 'E-mail address can\'t be blank',
      emailFormat: 'Please enter a valid e-mail address. Example: username@domain.com',
      emailUniqueness: 'This e-mail address has already been registered',
      passwordRequired: 'Password can\'t be blank',
      passwordRepeat: 'Password doesn\'t match',
      emailVerified: 'E-mail hasn\'t been verified',
      emailNotFound: 'E-mail not found',
      activeKeyRequired: 'Active key can\'t be blank',
      activeKeyNotPassed: 'Active key not passed',
      usernameRequired: 'Username can\'t be blank',
      usernameNotFound: 'Account with this username not found',
      tagRequired: 'Tag can\'t be blank',
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
      activeKey: 'Active key (private)',
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
    imageIsHidden: 'Image is hidden. Click to show image.',
    emptyCategoryHelp: 'No posts in this category.',
    removeFlag: 'Remove flag',
    downvotePost: 'Downvote post'
  },
  welcome: {
    createRegistration: 'Create profile',
    addSteemOrGolosAccount: 'Add Steem or Golos account',
    setUpCategories: 'Set up categories',
    chooseChainStep: {
      help: 'Please attach Steem or Golos account. You can later add more accounts in your profile'
    },
    attachChainStep: {
      header: 'Thank you for registration!',
      help: 'Please attach Steem or Golos account. You can later add more accounts in your profile.',
      addBlockchainAccount: 'Add blockchain account',
      addBlockchainAccountReplace: 'Add {blockchain} account',
      skipThisStep: 'Skip this step',
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
    help: 'Add a topic by typing in the field above and pressing "enter" or by clicking on one of the popular tags. Tags will be displayed in the same order in your feed.',
    helpSettings: 'Add a topic by typing in the field above and pressing "enter". Tags will be displayed in the same order in your feed.'
  },
  accountForm: {
    removeAccount: 'Remove account',
    addAccount: 'Add account',
    cancelRemoveAccount: 'Cancel',
    aboutPrivate: '<em>OnePlace does not store your private keys</em>. Once you sign in with your bloackchain account you authorize OnePlace app to vote, post and edit comments on your behalf. You can revoke that authority at any time.',
    aboutRemove: '<em>Remove account</em>. You are going to remove posting authority from OnePlace app. Confirm this operation with your private active key.',
  },
  topBar: {
    addAccount: 'Add account',
    getStarted: 'Get started',
    settings: 'Settings',
    switchAccount: 'Switch account',
    logout: 'Logout'
  },
  footer: {
    createdBy: 'Created in 2017 by {link}',
    language: 'Select language'
  },
  settings: {
    header: 'Profile settings',
    blockchainAccounts: 'Attached accounts',
    addBlockChainAccount: 'Please attach your Steem or Golos account',
    categoriesList: 'Followed categories',
    noAddedAccountsYet: 'No added accounts yet'
  },
  auth: {
    SignIn: 'Log in',
    ResetPassword: 'Reset password',
    CreateAccount: 'Create profile',
    ChangePassword: 'Change password',
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
        header: 'Successful recovery access',
        body: 'You will be automatically redirected in 5 seconds.'
      },
      fail: {
        header: 'Failure recovery access',
        body: 'Your session has expired, you can repeat {action}.',
        action: 'the recovery procedure'
      }
    },
    login: {
      help: '<strong>Note:</strong> If you use Steem or Golos account for signing in you will not be able to access all functions. To use full functionality please create OnePlace account based on your Steem or Golos account.', // removed
      forgot: 'Forgot your password?',
      wrongCredentials: 'E-mail or password you entered is incorrect'
    },
    registration: {
      success: {
        header: 'Thank you for registration!',
        body1: 'Registration e-mail sent.',
        body2: 'To complete the registration process look for an e-mail in your inbox that provides further instructions.'
      }
    }
  }
}