module.exports = {
  errors: {
    UNKNOW_ERROR: 'Неизвестная ошибка.',
    STEEMIT_MAX_VOTE_CHANGES: 'Вы использовали максимальное число изменений голоса для данной записи',
    STEEMIT_MIN_VOTE_INTERVAL_SEC: 'Вы можете голосовать за записи не чаще одного раза в 3 секунды'
  },
  common: {
    in: 'в',
    reply: 'Ответить',
    back: 'Назад',
    tags: 'Тэги',
    author: 'Автор',
    returnToOnePlace: 'Вернуться на OnePlace',
    validate: {
      emailRequired: 'Адрес e-mail не может быть пустым',
      emailFormat: 'Пожалуйста введите действительный адрес e-mail. Пример: username@domain.com',
      emailUniqueness: 'Этот адрес e-mail уже используется',
      passwordRequired: 'Пароль не может быть пустым',
      passwordRepeat: 'Пароль не совпадает',
      emailVerified: 'Адрес e-mail не был подтвержден',
      emailNotFound: 'Адрес e-mail не найден',
      activeKeyRequired: 'Активный ключ не может быть пустым',
      activeKeyNotPassed: 'Активный ключ не прошел проверку',
      usernameRequired: 'Имя пользователя не может быть пустым',
      usernameNotFound: 'Аккаунта с таким именем не существует',
      tagRequired: 'Тэг не может быть пустым',
      tagFormat: 'Используйте только буквы, цифры и один дефис',
      tagLimited: 'Максимальное число тэгов',
      tagMax: 'Максимальная длина 64',
      firstIsLetter: 'Тэг должен начинаться с буквы',
      lastIsLetterOrDigit: 'Тэг должен заканчиваться буквой или цифрой',
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
    removeVote: 'Отменить голос'
  },
  addAccount: {
    header: 'Пришло время добавить ваш {blockchain} аккаунт!',
    help: 'Пожалуйста введите необходимую информацию в форму ниже. Позже вы сможете добавить дополнительные аккаунты в своем профиле.',
    backToOnePlace: 'Вернуться на OnePlace'
  },
  chains: {
    imageIsHidden: 'Изображение скрыто. Нажмите, чтобы увидеть изображение.',
    emptyCategoryHelp: 'Нет записей в данной категории.',
    removeFlag: 'Отменить флаг',
    downvotePost: 'Проголосовать против'
  },
  welcome: {
    createRegistration: 'Создать профиль',
    addSteemOrGolosAccount: 'Добавить аккаунт Steem или Golos',
    setUpCategories: 'Настроить категории',
    chooseChainStep: {
      help: 'Пожалуйста прикрепите аккаунт Steem или Golos. Позже вы сможете добавить дополнительные аккаунты в своем профиле.'
    },
    attachChainStep: {
      header: 'Спасибо за регистрацию!',
      help: 'Пожалуйста прикрепите аккаунт Steem или Golos. Позже вы сможете добавить дополнительные аккаунты в своем профиле.',
      addBlockchainAccount: 'Добавить блокчейн аккаунт',
      addBlockchainAccountReplace: 'Добавить аккаунт {blockchain}',
      skipThisStep: 'Пропустить этот шаг'
    },
    setupTagsStep: {
      header: 'Пожалуйста выберите интересующие вас категории',
      startYourJourney: 'Начать путешествие'
    }
  },
  tagsForm: {
    approve: 'Подтвердить',
    clearAllChainTags: 'Удалить все тэги {blockchain}',
    addTags: 'Добавить тэги',
    addTagsWithChain: 'Добавить тэги {blockchain}',
    upTo20: 'Не более 20',
    help: 'Чтобы добавить в свои подписки интересующую вас тему, введите выше её название и нажмите "enter" или выберите из предложенных на картинках наиболее популярных категорий. Тэги будут отображаться в вашей ленте в том же порядке.',
    helpSettings: 'Чтобы добавить в свои подписки интересующую вас тему, введите выше её название и нажмите "enter". Тэги будут отображаться в вашей ленте в том же порядке.'
  },
  accountForm: {
    removeAccount: 'Удалить аккаунт',
    addAccount: 'Добавить аккаунт',
    cancelRemoveAccount: 'Отмена',
    aboutPrivate: '<em>OnePlace не хранит ваш приватный ключ</em>. Добавляя свой блокчейн аккаунт вы авторизуете приложение OnePlace для голосования, публикации и редактирования записей от вашего имени. Вы можете отменить это разрешение в любой момент.',
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
    createdBy: 'Создано 2017 by {link}',
    language: 'Выбрать язык'
  },
  settings: {
    header: 'Настройки профиля',
    blockchainAccounts: 'Управление аккаунтами',
    addBlockChainAccount: 'Пожалуйста добавьте аккаунт Steem или Golos.',
    categoriesList: 'Подписка на категории',
    noAddedAccountsYet: 'Нет добавленных аккаунтов'
  },
  auth: {
    SignIn: 'Войти',
    ResetPassword: 'Сбросить пароль',
    CreateAccount: 'создать профиль',
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
      wrongCredentials: 'Неверный адрес e-mail или пароль'
    },
    registration: {
      success: {
        header: 'Спасибо за регистрацию!',
        body1: 'Отправлен e-mail.',
        body2: 'Чтобы завершить процесс регистрации откройте почту и прочтите e-mail с дальнейшими инструкциями'
      }
    }
  }
}