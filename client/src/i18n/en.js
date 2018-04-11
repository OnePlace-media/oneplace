module.exports = {
  errors: {
    STEEMIT_MIN_REPLY_INTERVAL: 'You may only comment once every 20 seconds',
    FAILED_APPEND_POST_BY_AUTHOR: 'Loading posts error, please try again later',
    UNKNOW_ERROR: 'Something is wrong.',
    STEEMIT_MAX_VOTE_CHANGES: 'You have used the maximum number of vote changes on this comment',
    STEEMIT_MIN_VOTE_INTERVAL_SEC: 'You can only vote once every 3 seconds',
    NET_PROBLEM: 'A network error has occurred, check your connection and try again',
    STEEMIT_MIN_ROOT_COMMENT_INTERVAL: 'You may only post once every 5 minutes'
  },
  common: {
    cancel: 'Cancel',
    orderBy: 'Order by',
    in: 'in',
    reply: 'Reply',
    back: 'Back',
    tags: 'Tags',
    author: 'Author',
    edit: 'Edit',
    delete: 'Delete',
    returnToOnePlace: 'Return to OnePlace',
    validate: {
      emailRequired: 'E-mail address can\'t be blank',
      emailFormat: 'Please enter a valid e-mail address. Example: username@domain.com',
      emailUniqueness: 'This e-mail address has already been registered',
      passwordRequired: 'Password can\'t be blank',
      passwordRepeat: 'Password doesn\'t match',
      emailVerified: 'E-mail hasn\'t been verified',
      emailNotFound: 'E-mail not found',
      activeKeyRequired: 'Private key can\'t be blank',
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
      confirmAccountPostingKey: 'Private posting key',
      activeKey: 'Active key (private)',
      leaveAComment: 'Leave a comment...'
    }
  },
  comment: {
    header: 'Comments',
    confirmDeleteComment: 'Confirm delete comment',
    post: 'Post',
    update: 'Update',
    preview: 'Preview',
    dislike: 'Dislike',
    like: 'Like',
    removeVote: 'Remove vote',
    orderBy: {
      trending: 'Trending',
      popular: 'Popular',
      recent_first: 'Recent first',
      oldest_first: 'Oldest first'
    },
    register: 'register',
    logIn: 'Log in',
    onlyRegisteredCanLeaveComments: 'Only registered users with attached {blockchain} account can leave comments.',
    addAccountToReply: '{add-account} to reply.',
    addAccounChain: 'Add&nbsp;{blockchain} account',
    loginOrRegisterToReply: '{login-link}{nbsp}or{nbsp}{reg-link} to reply.'
  },
  addAccount: {
    header: 'Add {blockchain} account',
    help: 'Please enter required information in the form below. You can later add more accounts in your profile.',
    backToOnePlace: 'Back to OnePlace',
    advancedMode:'Advanced mode'
  },
  chains: {
    imageIsHidden: 'Image is hidden. Click to show image.',
    emptyCategoryHelp: 'No posts in this category.',
    removeFlag: 'Remove flag',
    downvotePost: 'Downvote post',
    pendingPayout: 'Pending payout is {payout} {fromNow}.',
    pendingDays: '1&nbsp;day | {count}&nbsp;days',
    readyPayout: 'Past payouts {payout}',
    andMore: '...and {count} more'
  },
  welcome: {
    createRegistration: 'Create profile',
    addSteemOrGolosAccount: 'Add Steem or Golos account',
    setUpCategories: 'Set up categories',
    chooseChainStep: {
      help: 'Please attach Steem or Golos account. You can later add more accounts in your profile'
    },
    attachStep: {
      header: 'Thank you for registration!',
      help: 'Please attach Steem or Golos account. You can later add more accounts in your profile.',
      addBlockchainAccount: 'Add {blockchain} account',
      skipThisStep: 'Skip this step',
    },
    confirmStep: {
      header: 'Confirm Account',
      help: 'Please confirm account access by signing in with private posting key.',
      help2: 'OnePlace does not store your private keys.',
      confirmAccount: 'Confirm account'
    },
    tagsStep: {
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
    aboutPrivate: '<em>OnePlace does not store your private keys</em>. Once you sign in with your blockchain account you authorize OnePlace app to vote, post and edit comments on your behalf. You can revoke that authority at any time.',
    aboutRemove: '<em>Remove account</em>. You are going to remove posting authority from OnePlace app. Confirm this operation with your private active key.',
    addWithSteemConnect: 'Add with SteemConnect',
    removeWithSteemConnect:'Remove with SteemConnect'
  },
  topBar: {
    createNewPost: 'Create new post',
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
  profile: {
    isFollower: 'Following',
    follow: 'Follow',
    following: 'Not following anybody | Following | Following',
    unfollow: 'Unfollow',
    block_user: 'Block&nbsp;user',
    location: 'Location',
    website: 'Website',
    posts: 'Posts | Post | Posts',
    followers: 'No followers | Follower | Followers',
    allPosts: 'All posts',
    accountPosts: 'Posts by {username}',
    posted: 'Posted',
    repostedFrom: 'Reposted from',
    emptyBlog: 'This user has not posted anything yet.',
    emptyBlogByFilters: 'No posts matched your criteria. You can change or clear the tag filters.',
    topTags: 'Popular tags',
    showAllTags: 'Show all tags',
    clearFilters: 'Clear filters',
    allTags: 'All tags',
    removeTag: 'Remove tag',
    accBlogs: '{username}\'s blog'
  },
  publish: {
    untitled: 'Untitled',
    publish: 'Publish',
    update: 'Update',
    readyToPublish: 'Ready to publish?',
    confirmUpdates: 'Confirm updates?',
    addTags_upTo5: 'Add tags (up to 5)',
    editTags: 'Edit tags',
    typeTagsHere: 'Type tags here...',
    payoutSettings: 'Payout settings',
    '50': '50% / 50% (Recommended)',
    '100s': '100% STEEM POWER',
    '100g': '100% GOLOS POWER',
    '0': 'Decline rewards',
    upVotePost: 'Upvote post',
    enterPostTitle: 'Title',
    typeYourStoryHere: 'Type your story here...',
    newPost: 'New post',
    draft: 'Draft',
    edit: 'Edit',
    drafts: 'Drafts',
    youHaveNoDrafts: 'You have no drafts.',
    createNewDraft: 'Create new draft',

    pasteLinkUrlHere: 'Paste URL here...',
    pasteImageLinkOrUploadImageFromYourDevice: 'Paste image URL or upload from your device...',
    upload: 'Upload',
    bold: 'Bold',
    italic: 'Italic',
    heading: 'Heading',
    headingSmaller: 'Smaller Heading',
    headingBigger: 'Bigger Heading',
    code: 'Code',
    quote: 'Quote',
    unorderedList: 'Generic List',
    orderedList: 'Numbered List',
    insertLink: 'Insert Link',
    insertImage: 'Insert Image',
    horizontalRule: 'Insert Line',
    guide: 'Markdown Guide',
    togglePreview: 'Toggle Preview',
    fullscreen: 'Toggle Fullscreen',
    wrapper: 'Formatting',
    centered: 'Centered',
    justified: 'Justified',
    pullLeft: 'Pull Left',
    pullRight: 'Pull Right',
    insertLine: 'Insert Line',
    indient: 'Indent Text',

    errors: {
      TYPE: 'Uploaded file must have type like image/*',
      SUPPORT: 'Only gif, png, jpeg, webp formats are supported',
      SIZE_GIF: 'Uploaded file size must be less than 20Mb',
      SIZE: 'Uploaded file size must be less than 2Mb',
      null: ''
    }
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
