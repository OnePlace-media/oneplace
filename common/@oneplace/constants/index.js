module.exports = {
  ORDER_BY_LIST: {
    TRENDING: 'trending',
    POPULAR: 'popular',
    RECENT_FIRST: 'recent_first',
    OLDEST_FIRTS: 'oldest_first'
  },
  WELCOME: {
    STEPS: {
      ATTACH: 2,
      CONFIRM:3,
      TAGS: 4,
      

      CHOOSE_CHAIN: 1,
      ATTACH_CHAIN: 2,
      SETUP_TAGS: 3
    }
  },
  DEFAULT: {
    POST_IMAGE: '/static/img/default-img.jpg',
    AVATAR_IMAGE: '/static/img/avatar.svg',
    TAGS: {
      s: [
        {text: "steemit"},
        {text: "life"},
        {text: "photography"},
        {text: "art"},
        {text: "bitcoin"},
        {text: "travel"},
        {text: "story"},
        {text: "money"},
        {text: "introduceyourself"},
        {text: "food"},
        {text: "blockchain"},
        {text: "news"},
        {text: "philosophy"},
        {text: "science"},
        {text: "funny"},
        {text: "health"},
        {text: "nature"},
        {text: "politics"},
        {text: "music"},
        {text: "video"}
      ],
      g: [
        {text: "ru--golos"},
        {text: "ru--zhiznx"},
        {text: "ru--fotografiya"},
        {text: "ru--iskusstvo"},
        {text: "ru--tvorchestvo"},
        {text: "ru--obrazovanie"},
        {text: "ru--blokcheijn"},
        {text: "ru--statistika"},
        {text: "ru--stikhi"},
        {text: "ru--otkrytyij-kod"},
        {text: "ru--znakomstvo"},
        {text: "ru--yekonomika"},
        {text: "ru--konkurs"},
        {text: "ru--puteshestviya"},
        {text: "ru--istoriya"},
        {text: "ru--programmirovanie"},
        {text: "ru--priklyucheniya"},
        {text: "ru--mysli"},
        {text: "ru--priroda"},
        {text: "ru--nauka"}
      ]
    }
  },
  BLOCKCHAIN: {
    SOURCE: {
      STEEM: 's',
      GOLOS: 'g'
    },
    PREFIXES: {
      's': 'STM',
      'g': 'GLS'
    },
    MAX_PAYOUT_PENDING_DAYS: {
      's': 7,
      'g': 30
    },
    MODES: {
      FIRST_PAYOUT: 'first_payout',
      SECOND_PAYOUT: 'second_payout',
      ARCHIVED: 'archived'
    }
  },
  USER: {
    ROLE: {
      USER: 1,
      ADMIN: 2
    },
    STATUS: {
      ACTIVE: 1,
      BANNED: 2
    }
  }
}