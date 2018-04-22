module.exports = {
  errors: {
    STEEMIT_MIN_REPLY_INTERVAL: 'Вы можете комментировать только 1 раз в 20 секунд',
    FAILED_APPEND_POST_BY_AUTHOR: 'Ошибка загрузки постов, попробуйте позже',
    UNKNOW_ERROR: 'Неизвестная ошибка.',
    STEEMIT_MAX_VOTE_CHANGES: 'Вы использовали максимальное число изменений голоса для данной записи',
    STEEMIT_MIN_VOTE_INTERVAL_SEC: 'Вы можете голосовать за записи не чаще одного раза в 3 секунды',
    NET_PROBLEM: 'Произошла сетевая ошибка, проверьте ваше подключение и попробуйте снова',
    STEEMIT_MIN_ROOT_COMMENT_INTERVAL: 'Вы можете создавать посты не чаще одного раза в 5 минут'
  },
  common: {
    cancel: 'Отмена',
    orderBy: 'Сортировать по',
    in: 'в',
    reply: 'Ответить',
    back: 'Назад',
    tags: 'Теги',
    author: 'Автор',
    edit: 'Редактировать',
    delete: 'Удалить',
    returnToOnePlace: 'Вернуться на OnePlace',
    validate: {
      emailRequired: 'Строка "e-mail" не может быть пустой',
      emailFormat: 'Пожалуйста введите действительный адрес e-mail. Пример: username@domain.com',
      emailUniqueness: 'Этот адрес e-mail уже используется',
      passwordRequired: 'Строка "пароль" не может быть пустой',
      passwordRepeat: 'Пароль не совпадает',
      emailVerified: 'Адрес e-mail не был подтвержден',
      emailNotFound: 'Адрес e-mail не найден',
      activeKeyRequired: 'Приватный активный ключ не может быть пустым',
      activeKeyNotPassed: 'Приватный активный ключ не прошел проверку',
      postingKeyRequired: 'Приватный постинг ключ не может быть пустым',
      postingKeyNotPassed: 'Приватный постинг ключ не прошел проверку',
      usernameRequired: 'Имя пользователя не может быть пустым',
      usernameNotFound: 'Аккаунта с таким именем не существует',
      tagRequired: 'Строка тегов не может быть пустой',
      tagFormat: 'Используйте только буквы, цифры и один дефис',
      tagLimited: 'У вас уже максимальное число тегов',
      tagMax: 'Максимальная длина 64',
      firstIsLetter: 'Тег должен начинаться с буквы',
      lastIsLetterOrDigit: 'Тег должен заканчиваться буквой или цифрой',
      usernameMissingPermission: 'Отсутствует авторизация постинга для данного аккаунта'
    },
    timeAgoWithAuthor: '{timeago} {author}',
    headers: {
      recentPosts: 'Свежие записи'
    },
    placeholders: {
      email: 'E-mail',
      password: 'Пароль',
      passwordRepeat: 'Повторите пароль',
      username: 'Имя пользователя',
      addAccountUsername: 'Имя пользователя {blockchain}',
      addAccountActiveKey: 'Приватный активный ключ',
      confirmAccountPostingKey: 'Приватный постинг ключ',
      activeKey: 'Приватный активный ключ',
      leaveAComment: 'Добавить комментарий...'
    }
  },
  comment: {
    header: 'Комментарии',
    confirmDeleteComment: 'Подтвердите удаление комментария',
    post: 'Отправить',
    update: 'Обновить',
    preview: 'Предварительный просмотр',
    dislike: 'Мне не нравится',
    like: 'Мне нравится',
    removeVote: 'Отменить голос',
    orderBy: {
      trending: 'Популярности',
      popular: 'Голоса',
      recent_first: 'Сначала новые',
      oldest_first: 'Сначала старые'
    },
    logIn: 'Войдите',
    register: 'зарегистрируйтесь',
    onlyRegisteredCanLeaveComments: 'Только зарегистрированные пользователи со связанным аккаунтом {blockchain} могут оставлять комментарии.',
    addAccountToReply: '{add-account}, чтобы ответить.',
    addAccounChain: 'Добавьте&nbsp;аккаунт {blockchain}',
    loginOrRegisterToReply: '{login-link}{nbsp}или{nbsp}{reg-link}, чтобы ответить.'

  },
  addAccount: {
    header: 'Добавить аккаунт {blockchain}',
    help: 'Пожалуйста, введите необходимую информацию в форму ниже. Позже вы сможете добавить дополнительные аккаунты в своем профиле.',
    backToOnePlace: 'Вернуться на OnePlace',
    advancedMode: 'Расширенный режим'
  },
  chains: {
    imageIsHidden: 'Изображение скрыто. Нажмите, чтобы увидеть изображение.',
    emptyCategoryHelp: 'Нет записей в данной категории.',
    removeFlag: 'Отменить флаг',
    downvotePost: 'Проголосовать против',
    pendingPayout: 'Ожидаемая выплата {payout} {fromNow}.',
    pendingDays: '1&nbsp;день | {count}&nbsp;дней',
    readyPayout: 'Предыдущие выплаты {payout}',
    andMore: 'и еще {count}'
  },
  welcome: {
    createRegistration: 'Создание профиля',
    addSteemOrGolosAccount: 'Добавление аккаунта Steem или Golos',
    setUpCategories: 'Настройка категорий',
    chooseChainStep: {
      help: 'Пожалуйста, прикрепите аккаунт Steem или Golos. Позже вы сможете добавить дополнительные аккаунты в своем профиле.'
    },
    attachStep: {
      header: 'Спасибо за регистрацию!',
      help: 'Пожалуйста, прикрепите аккаунт Steem или Golos. Позже вы сможете добавить дополнительные аккаунты в своем профиле.',
      addBlockchainAccount: 'Добавить аккаунт {blockchain}',
      skipThisStep: 'Пропустить этот шаг'
    },
    confirmStep: {
      header: 'Подтвердить аккаунт',
      help: 'Подтвердите доступ к учетной записи, выполнив вход с помощью приватного постинг ключа.',
      help2: 'OnePlace не сохраняет ваши приватные ключи.',
      confirmAccount: 'Подтвердить аккаунт'
    },
    tagsStep: {
      header: 'Выберите интересующие вас категории',
      startYourJourney: 'Начать погружение'
    }
  },
  tagsForm: {
    approve: 'Подтвердить',
    clearAllChainTags: 'Удалить все теги {blockchain}',
    addTags: 'Добавить теги',
    addTagsWithChain: 'Добавить теги',
    upTo20: 'Не более 20',
    typeTagsHere: 'Введите теги',
    help: 'Введите название категории, на которую хотите подписаться, и нажмите "enter" или выберите из предложенных тегов. В вашей ленте порядок категорий сохранится.',
    helpSettings: 'Введите название категории, на которую хотите подписаться, и нажмите "enter". В вашей ленте порядок категорий сохранится.'
  },
  accountForm: {
    removeAccount: 'Удалить аккаунт',
    addAccount: 'Добавить аккаунт',
    cancelRemoveAccount: 'Отмена',
    aboutPrivate: '<em>OnePlace не хранит ваш приватный ключ</em>. Добавляя свой блокчейн аккаунт, вы авторизуете приложение OnePlace для голосования, публикации и редактирования записей от вашего имени. Вы можете отменить это разрешение в любой момент.',
    aboutRemove: '<em>Удаление аккаунта</em>. Вы отменяете авторизацию для приложения OnePlace. Подтвердите эту операцию приватным активным ключом.',
    addWithSteemConnect: 'Добавить через SteemConnect',
    removeWithSteemConnect: 'Удалить через SteemConnect'
  },
  topBar: {
    createNewPost: 'Новая запись',
    addAccount: 'Добавить аккаунт',
    getStarted: 'Войти',
    settings: 'Настройки',
    switchAccount: 'Сменить аккаунт',
    logout: 'Выйти',
    popular: 'Популярное',
    feed: 'Лента',
    blog: 'Блог'
  },
  footer: {
    createdBy: 'Создано 2017 {link}',
    language: 'Выбрать язык'
  },
  settings: {
    header: 'Настройки профиля',
    blockchainAccounts: 'Управление аккаунтами',
    addBlockChainAccount: 'Добавить аккаунт Steem или Golos',
    categoriesList: 'Подписка на категории',
    noAddedAccountsYet: 'Нет добавленных аккаунтов'
  },
  feed: {
    repostedBy: 'Репост от',
    filterByTags: 'Фильтр по тегам',
    following: 'Подписки',
    noPostsMessage: 'Похоже, что {username} еще ни на кого не подписан! Если {username} недавно подписался на новых пользователей, лента подписок начнет заполняться сразу после появления нового контента.',
    noPostsMessageOwner: 'Похоже, что вы еще ни на кого не подписаны! Если вы недавно подписались на новых пользователей, лента подписок начнет заполняться сразу после появления нового контента.'
  },
  profile: {
    isFollower: 'Вы подписаны',
    follow: 'Подписаться',
    following: 'Нет подписок | Подписки | Подписки',
    unfollow: 'Отписаться',
    block_user: 'Блокировать&nbsp;пользователя',
    location: 'Местоположение',
    website: 'Сайт',
    posts: 'Публикаций | Публикация | Публикаций',
    followers: 'Нет подписчиков | Подписчик | Подписчика',
    allPosts: 'Все записи',
    accountPosts: 'Записи {username}',
    posted: 'Создано',
    repostedFrom: 'Репост от',
    emptyBlog: 'Этот пользователь ещё не опубликовал ни одной записи.',
    emptyBlogByFilters: 'Нет записей, соответствующих данным условиям. Вы можете изменить или сбросить фильтры тегов.',
    topTags: 'Популярные теги',
    showAllTags: 'Все теги',
    allTags: 'Все теги',
    clearFilters: 'Сбросить фильтры',
    removeTag: 'Исключить тег',
    accBlogs: 'Блог {username}'
  },
  publish: {
    untitled: 'Без названия',
    publish: 'Публикация',
    update: 'Обновить',
    readyToPublish: 'Готовы к публикации?',
    confirmUpdates: 'Подтвердить изменения?',
    addTags_upTo5: 'Добавьте теги (не более 5)',
    editTags: 'Редактировать теги',
    typeTagsHere: 'Введите теги...',
    payoutSettings: 'Настройки выплаты',
    '50': '50% / 50% (Рекомендовано)',
    '100s': '100% STEEM POWER',
    '100g': '100% Сила Голоса',
    '0': 'Отказаться от вознаграждения',
    upVotePost: 'Голосовать за пост',
    enterPostTitle: 'Заголовок',
    typeYourStoryHere: 'Напишите свою историю...',
    newPost: 'Новая запись',
    draft: 'Черновик',
    edit: 'Редактирование',
    drafts: 'Черновики',
    youHaveNoDrafts: 'У вас нет черновиков',
    createNewDraft: 'Создать новый черновик',

    pasteLinkUrlHere: 'Вставьте ссылку...',
    pasteImageLinkOrUploadImageFromYourDevice: 'Вставьте ссылку или загрузите изображение...',
    upload: 'Загрузка',
    bold: 'Жирный',
    italic: 'Курсив',
    heading: 'Заголовок',
    headingSmaller: 'Меньший заголовок',
    headingBigger: 'Больший заголовок',
    code: 'Код',
    quote: 'Цитата',
    unorderedList: 'Список',
    orderedList: 'Нумерованный список',
    insertLink: 'Вставить ссылку',
    insertImage: 'Вставить изображение',
    horizontalRule: 'Вставить линию',
    guide: 'Гид по Markdown',
    togglePreview: 'Предварительный просмотр',
    fullscreen: 'Полноэкранный режим',
    wrapper: 'Форматирование',
    centered: 'По центру',
    justified: 'По ширине',
    pullLeft: 'Обтекание справа',
    pullRight: 'Обтекание слева',
    insertLine: 'Вставить линию',
    indient: 'Красная строка',

    errors: {
      TYPE: 'Загружаемый файл должен быть типа image/*',
      SUPPORT: 'Поддерживаются только форматы gif, png, jpeg, webp',
      SIZE_GIF: 'Размер загружаемого файла должен быть меньше 20Mb',
      SIZE: 'Размер загружаемого файла должен быть меньше 2Mb',
      null: ''
    }
  },
  auth: {
    SignIn: 'Войти',
    ResetPassword: 'Сбросить пароль',
    CreateAccount: 'Создать профиль',
    ChangePassword: 'Изменить пароль',
    recovery: {
      header: 'Восстановление утерянного пароля',
      help: 'Введите адрес e-mail, использованный при регистрации, и мы отправим вам ссылку для изменения пароля.',
      success: {
        header: 'Проверьте вашу почту',
        body: 'На ваш адрес отправлен e-mail с инструкциями по изменению пароля.'
      }
    },
    reset: {
      header: 'Ваш пароль был изменен',
      help: 'Пожалуйста введите новый пароль',
      success: {
        header: 'Успешное восстановление пароля',
        body: 'В течение 5 секунд вы будете автоматически перенаправлены.'
      },
      fail: {
        header: 'Отказ в восстановлении пароля',
        body: 'Ваша сессия истекла, вы можете повторить {action}.',
        action: 'процедуру восстановления'
      }
    },
    login: {
      help: '<strong>Note:</strong> If you use Steem or Golos account for signing in you will not be able to access all functions. To use full functionality please create OnePlace account based on your Steem or Golos account.', // removed
      forgot: 'Забыли пароль?',
      wrongCredentials: 'Неверный e-mail адрес или пароль'
    },
    registration: {
      success: {
        header: 'Спасибо за регистрацию!',
        body1: 'E-mail отправлен.',
        body2: 'Чтобы завершить процесс регистрации откройте почту и прочтите e-mail с дальнейшими инструкциями'
      }
    }
  }
}
