module.exports = {
  errors: {
    FAILED_APPEND_POST_BY_AUTHOR: 'Ошибка загрузки постов, попробуйте позже',
    UNKNOW_ERROR: 'Неизвестная ошибка.',
    STEEMIT_MAX_VOTE_CHANGES: 'Вы использовали максимальное число изменений голоса для данной записи',
    STEEMIT_MIN_VOTE_INTERVAL_SEC: 'Вы можете голосовать за записи не чаще одного раза в 3 секунды'
  },
  common: {
    orderBy: 'Сортировать по',
    in: 'в',
    reply: 'Ответить',
    back: 'Назад',
    tags: 'Теги',
    author: 'Автор',
    returnToOnePlace: 'Вернуться на OnePlace',
    validate: {
      emailRequired: 'Строка "e-mail" не может быть пустой',
      emailFormat: 'Пожалуйста введите действительный адрес e-mail. Пример: username@domain.com',
      emailUniqueness: 'Этот адрес e-mail уже используется',
      passwordRequired: 'Строка "пароль" не может быть пустой',
      passwordRepeat: 'Пароль не совпадает',
      emailVerified: 'Адрес e-mail не был подтвержден',
      emailNotFound: 'Адрес e-mail не найден',
      activeKeyRequired: 'Активный ключ не может быть пустым',
      activeKeyNotPassed: 'Активный ключ не прошел проверку',
      usernameRequired: 'Имя пользователя не может быть пустым',
      usernameNotFound: 'Аккаунта с таким именем не существует',
      tagRequired: 'Строка тегов не может быть пустой',
      tagFormat: 'Используйте только буквы, цифры и один дефис',
      tagLimited: 'У вас уже максимальное число тегов',
      tagMax: 'Максимальная длина 64',
      firstIsLetter: 'Тег должен начинаться с буквы',
      lastIsLetterOrDigit: 'Тег должен заканчиваться буквой или цифрой',
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
      addAccountActiveKey: 'Активный приватный ключ',
      activeKey: 'Активный приватный ключ',
      leaveAComment: 'Добавить комментарий...'
    }
  },
  comment: {
    header: 'Комментарии',
    post: 'Отправить',
    cancel: 'Отмена',
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
    onlyRegisteredCanLeaveComments: 'Только зарегистрированные пользователи со связанным {blockchain} аккаунтом могут оставлять комментарии.',
    addAccountToReply: '{add-account}, чтобы ответить.',
    addAccounChain: 'Добавьте&nbsp;{blockchain} аккаунт',
    loginOrRegisterToReply: '{login-link}&nbsp;или&nbsp;{reg-link}, чтобы ответить.'

  },
  addAccount: {
    header: 'Пришло время добавить ваш {blockchain} аккаунт.',
    help: 'Пожалуйста, введите необходимую информацию в форму ниже. Позже вы сможете добавить дополнительные аккаунты в своем профиле.',
    backToOnePlace: 'Вернуться на OnePlace'
  },
  chains: {
    imageIsHidden: 'Изображение скрыто. Нажмите, чтобы увидеть изображение.',
    emptyCategoryHelp: 'Нет записей в данной категории.',
    removeFlag: 'Отменить флаг',
    downvotePost: 'Проголосовать против',
    pendingPayout: 'Ожидаемая выплата {payout} через {days}.',
    pendingDays: '1&nbsp;день | {count}&nbsp;дней',
    readyPayout: 'Предыдущие выплаты {payout}',
    andMore: '...и еще {count}'
  },
  welcome: {
    createRegistration: 'Создание профиля',
    addSteemOrGolosAccount: 'Добавление аккаунта Steem или Golos',
    setUpCategories: 'Настройка категорий',
    chooseChainStep: {
      help: 'Пожалуйста, прикрепите аккаунт Steem или Golos. Позже вы сможете добавить дополнительные аккаунты в своем профиле.'
    },
    attachChainStep: {
      header: 'Спасибо за регистрацию!',
      help: 'Пожалуйста, прикрепите аккаунт Steem или Golos. Позже вы сможете добавить дополнительные аккаунты в своем профиле.',
      addBlockchainAccount: 'Добавить блокчейн аккаунт',
      addBlockchainAccountReplace: 'Добавить {blockchain} аккаунт',
      skipThisStep: 'Пропустить этот шаг'
    },
    setupTagsStep: {
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
    help: 'Введите название темы, на которую хотите подписаться, и нажмите "enter" или выберите из предложенных тегов. В вашей ленте порядок категорий сохранится.',
    helpSettings: 'Введите название темы, на которую хотите подписаться, и нажмите "enter" или выберите из предложенных тегов. В вашей ленте порядок категорий сохранится.'
  },
  accountForm: {
    removeAccount: 'Удалить аккаунт',
    addAccount: 'Добавить аккаунт',
    cancelRemoveAccount: 'Отмена',
    aboutPrivate: '<em>OnePlace не хранит ваш приватный ключ</em>. Добавляя свой блокчейн аккаунт, вы авторизуете приложение OnePlace для голосования, публикации и редактирования записей от вашего имени. Вы можете отменить это разрешение в любой момент.',
    aboutRemove: '<em>Удаление аккаунта</em>. Вы отменяете авторизацию для приложения OnePlace. Подтвердите эту операцию приватным активным ключом.',
  },
  topBar: {
    addAccount: 'Добавить аккаунт',
    getStarted: 'Войти',
    settings: 'Настройки',
    switchAccount: 'Сменить аккаунт',
    logout: 'Выйти'
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
  profile: {
    isFollower: 'Подписан',
    follow: 'Подписаться',
    following: 'Нет подписок | Подписки | Подписки',
    unfollow: 'Отписаться',
    block_user: 'Блокировать&nbsp;пользователя',
    location: 'Местоположение',
    website: 'Сайт',
    posts: 'Публикаций | Публикация | Публикаций',
    followers: 'Нет подписчиков | Подписчик | Подписчика',
    allPosts: 'Все записи',
    accountPosts:'Записи {username}',
    posted: 'Создано',
    repostedFrom: 'Репост от'
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
