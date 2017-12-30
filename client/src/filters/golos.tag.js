const golosHashMap = {
  'shch': 'щ',
  'yie': 'ые',
  'yo': 'ё',
  'zh': 'ж',
  'ij': 'й',
  'kh': 'х',
  'cz': 'ц',
  'ch': 'ч',
  'sh': 'ш',
  'xx': 'ъ',
  'ye': 'э',
  'yu': 'ю',
  'ya': 'я',
  'a': 'а',
  'b': 'б',
  'v': 'в',
  'g': 'г',
  'd': 'д',
  'e': 'е',
  'z': 'з',
  'i': 'и',
  'k': 'к',
  'l': 'л',
  'm': 'м',
  'n': 'н',
  'o': 'о',
  'p': 'п',
  'r': 'р',
  'c': 'с',
  's': 'с',
  't': 'т',
  'u': 'у',
  'f': 'ф',
  'x': 'ь',
  'y': 'ы'
}

const unGolosMassive = [
  ['щ', 'shch'],
  ['ые', 'yie'],
  ['ё', 'yo'],
  ['ж', 'zh'],
  ['й', 'ij'],
  ['х', 'kh'],
  ['ч', 'ch'],
  ['ш', 'sh'],
  ['ъ', 'xx'],
  ['э', 'ye'],
  ['ю', 'yu'],
  ['я', 'ya'],
  ['а', 'a'],
  ['б', 'b'],
  ['в', 'v'],
  ['г', 'g'],
  ['д', 'd'],
  ['е', 'e'],
  ['з', 'z'],
  ['и', 'i'],
  ['к', 'k'],
  ['л', 'l'],
  ['м', 'm'],
  ['н', 'n'],
  ['о', 'o'],
  ['п', 'p'],
  ['р', 'r'],
  ['с', 's'],
  ['т', 't'],
  ['у', 'u'],
  ['ф', 'f'],
  ['ц', 'cz'],
  ['ь', 'x'],
  ['ы', 'y']
];

const letters = unGolosMassive.map(el => el[0])

function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.substr(1, str.length - 1)
}

export function golosTag(input) {
  if (!letters.includes(input.toLowerCase().substring(0, 1)))
    return input

  let output = 'ru--' + input.toLowerCase()
  for (let change of unGolosMassive) {
    output = output.replace(new RegExp(change[0], 'g'), change[1])
  }
  return output
}

export function unGolosTag(input) {
  let result = ''
  if (input) {
    if (input.substring(0, 4) !== 'ru--')
      return ucfirst(input)

    let output = input.substring(4)
    for (let change in golosHashMap) {
      output = output.replace(new RegExp(change, 'g'), golosHashMap[change])
    }
    result = ucfirst(output)
  }

  return result
}

