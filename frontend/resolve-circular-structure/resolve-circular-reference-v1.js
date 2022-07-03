// 对象上面属性的原始引用
const objOriginalReference = new WeakMap()

function isRealObj (obj) {
  return (
    obj &&
        typeof obj === 'object' &&
        !(obj instanceof Boolean) &&
        !(obj instanceof Number) &&
        !(obj instanceof String) &&
        !(obj instanceof RegExp) &&
        !(obj instanceof Date)
  )
}

/**
 * 捕获对象属性的引用，不可以改变原来的对象，返回新的对象
 * @param obj
 * @param jsonPath 参考链接：xxx
 */
function captureObjCircularReference (obj, jsonPath) {
  // console.log(obj, jsonPath, 23);
  if (isRealObj(obj)) {
    // 把对象放到 WeakMap 中，保存索引
    let path = objOriginalReference.get(obj)
    // console.log(path);
    if (path !== undefined) {
      // 当前的值是循环引用的值
      return {
        $ref: path
      }
    } else {
      // 重置 path
      path = jsonPath
      objOriginalReference.set(obj, path)
    }
    // console.log(objOriginalReference);

    // 判断是数组还是对象 or Array.isArray
    if (obj instanceof Array) {
      return obj.map((item, index) => {
        if (isRealObj(item)) {
          return captureObjCircularReference(item, `${path}[${index}]`)
        }
        return item
      })
    } else {
      const copyObj = {}
      Object.keys(obj).forEach((key) => {
        // console.warn(key);
        const val = obj[key]
        if (isRealObj(val)) {
          copyObj[key] = captureObjCircularReference(val, `${path}["${key}"]`)
        } else {
          copyObj[key] = val
        }
      })
      return copyObj
    }
  }
  return obj
}

/**
 * 恢复循环引用
 * @param $
 */
function getCircularVal ($) {
  (function resumeObjCircularReference (obj) {
    if (Array.isArray(obj)) {
      obj.forEach(function (item, index) {
        if (item.$ref) {
          // eslint-disable-next-line no-eval
          obj[index] = eval(item.$ref)
        } else {
          if (isRealObj(item)) {
            resumeObjCircularReference(item)
          }
          obj[index] = item
        }
      })
    } else {
      Object.keys(obj).forEach(function (key) {
        console.log(key)
        const val = obj[key]
        // TODO 判断路径
        if (val.$ref) {
          // eslint-disable-next-line no-eval
          obj[key] = eval(val.$ref)
        } else {
          if (isRealObj(val)) {
            resumeObjCircularReference(val)
          } else {
            obj[key] = val
          }
        }
      })
    }
  })($)
  return $
}

export const clearRefer = (obj) => captureObjCircularReference(obj, '$')
export const resumeRefer = (obj) => getCircularVal(obj)
