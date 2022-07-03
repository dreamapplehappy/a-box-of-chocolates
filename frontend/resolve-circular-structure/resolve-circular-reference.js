/**
 * 判断一个对象是否是需要进行遍历的对象，排除基本类型的对象
 * @param obj
 * @returns {boolean}
 */
function isCommonObj (obj) {
  return obj &&
    typeof obj === 'object' &&
  !(obj instanceof Boolean) &&
  !(obj instanceof Number) &&
  !(obj instanceof String) &&
  !(obj instanceof RegExp) &&
  !(obj instanceof Date)
}

// 保存对象上面属性的索引
const propsReference = new WeakMap()

/**
 * 将对象指向自身的索引替换成常规JSON PATH字符串
 * @param obj
 * @param jsonPath
 * @returns {{}|any}
 */
function transformCircularObj (obj, jsonPath) {
  if (!jsonPath) {
    console.warn('jsonPath 是必须的')
    return
  }
  if (isCommonObj(obj)) {
    // 判断之前是否保存了对应的索引
    let path = propsReference.get(obj)
    if (path) {
      return path
    } else {
      path = jsonPath
      propsReference.set(obj, path)
    }

    // 判断是数组还是对象
    if (Array.isArray(obj)) {
      return obj.map(function (item, index) {
        if (isCommonObj(item)) {
          return transformCircularObj(item, `${path}["${index}"]`)
        } else {
          return item
        }
      })
    } else {
      const copyCat = {}
      Object.keys(obj).forEach(function (key) {
        const val = obj[key]
        if (isCommonObj(val)) {
          copyCat[key] = transformCircularObj(val, `${path}["${key}"]`)
        } else {
          copyCat[key] = val
        }
      })
      return copyCat
    }
  }
  // 非一般对象直接返回
  return obj
}

// 判断是否是 JSON PATH
const JSON_PATH_REGEX = /^\$(?:\["\w*"])*$/

function resumeObjReference ($) {
  // 保持 $ 指向根元素
  return (function iterRefer (obj) {
    // 判断 obj 是数组还是对象
    if (isCommonObj(obj)) {
      Object.keys(obj).forEach(function (key) {
        const val = obj[key]
        if (isCommonObj(val)) {
          obj[key] = iterRefer(val)
        } else {
          if (typeof val === 'string' && JSON_PATH_REGEX.test(val)) {
            // eslint-disable-next-line no-eval
            obj[key] = eval(val)
          } else {
            obj[key] = val
          }
        }
      })
    } else {
      obj.forEach(function (val, key) {
        if (isCommonObj(val)) {
          obj[key] = iterRefer(val)
        } else {
          if (typeof val === 'string' && JSON_PATH_REGEX.test(val)) {
            // eslint-disable-next-line no-eval
            obj[key] = eval(val)
          } else {
            obj[key] = val
          }
        }
      })
    }
    return obj
  })($)
}

export const clearRefer = (obj) => transformCircularObj(obj, '$')
export const resumeRefer = (obj) => resumeObjReference(obj)
