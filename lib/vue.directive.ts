import formatDate, { getDateDiff, dateNormalize } from './dateFormat';
import { msg } from '@component/message/message';
/**
 * 四舍五入保留num位小数
 * @param v
 * @param num 保留位数
 * @returns {*}
 */
function toDecimal(v, num) {
  var f = parseFloat(v);
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(v * (Math.pow(10, num))) / Math.pow(10, num);
  var s = f.toString();
  if (num) {
    var rs = s.indexOf('.');
    if (num > 0 && rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + num) {
      s += '0';
    }
  }
  return s;
}

let isRun = false;

export default function (app) {
  // v-number:0/2/rex="/\d/g"
  app.directive('number', {
    mounted(el, binding) {
      let currEl;
      if (el.nodeName == 'INPUT') {
        currEl = el;
      } else {
        currEl = el.querySelector('input')
      }
      const _type = binding.arg || 'decimal';
      let { rex, value } = binding.value || {};
      // console.log(currEl.value)
      currEl.$handler = (el) => {
        switch (_type) {
          // 数字 v-number:0
          case '0':
            el.value = el.value.replace(/[^\d]/, '');
            break;
          // 数字+小数 v-number
          case 'decimal':
            el.value = el.value.replace(/[^\d.]/g, ''); // 清除数字和'.'以外的字符  
            el.value = el.value.replace(/\.{2,}/g, '.'); // 连续两个'.', 只保留第一个'.'
            el.value = el.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.'); // 隔着字符, 也保证只有一个'.'
            el.value.indexOf('.') < 0 && el.value != '' && (el.value = parseFloat(el.value)); // 保证不会出现重复的: 00, 01, 02 ...
            el.value.indexOf('.') > -1 && el.value.length === 1 && (el.value = ''); // 第一位不能以'.'开头
            break;
          // 数字+两位小数 v-number:2
          case '2':
            el.value = el.value.replace(/[^\d.]/g, '');
            el.value = el.value.replace(/\.{2,}/g, '.');
            el.value = el.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
            el.value = el.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两位小数  
            el.value.indexOf('.') < 0 && el.value != '' && (el.value = parseFloat(el.value));
            el.value.indexOf('.') > -1 && el.value.length === 1 && (el.value = '');
            break;
          // 自定义, v-number:rex="{rex:/\d/g,value:''}"
          case 'rex':
            let regx = new RegExp(rex);
            if (rex) {
              el.value = el.value.replace(regx, value || '');
            }
            break;
        }
        el.dispatchEvent(new Event('input'))
      }
      currEl.$handler(currEl);
    },
    updated(el) {
      let currEl;
      if (el.nodeName == 'INPUT') {
        currEl = el;
      } else {
        currEl = el.querySelector('input')
      }
      currEl.$handler && currEl.$handler(currEl)
    }
  })

  app.directive('amount', {
    mounted(el, binding, vnode) {
      let element = el.tagName == 'INPUT' ? el : el.getElementsByTagName('input')[0]
      let len = !Number(binding.arg) ? 0 : Number(binding.arg);

      let curval = vnode.dirs.find(v => !!v.value);
      if (curval) {
        element.value = toDecimal(curval.value, len);
        el.dispatchEvent(new Event('input'))
      }

      element.addEventListener('keyup', function () {
        let val = element.value && element.value.replace(/[^\d\.]/g, '');
        element.value = val;
        el.dispatchEvent(new Event('input'))
      });

      element.addEventListener('blur', () => {
        let val = element.value && element.value.replace(/[^\d\.]/g, '');
        element.value = toDecimal(val, len);
        el.dispatchEvent(new Event('input'))
      })
    }
  });

  // v-date="yyyy-MM-dd" 
  app.directive('date', {
    mounted: (el, binding, vnode) => {
      let formate = binding.value;
      let value = el.innerText;
      el.innerText = formatDate(value, formate)
    }
  })

  // 默认图片 当没加载到图片，或图片地址出错时，显示默认图片
  // 使用方法  v-noimg="require('../assets/default.png').default"
  app.directive('noimg', {
    mounted: (el, binding, vnode) => {
      el.onerror = () => {
        el.src = binding.value
      }
    }
  })

  // v-diff:mm="{startime:'1623044574104',endtime:new Date(),callback:callback}"
  app.directive('diff', {
    updated(el, binding) {
      let startTime = dateNormalize(binding.value.startime)
      let endTime = dateNormalize(binding.value.endtime)
      let callback = binding.value.callback

      let md = binding.arg;//dd,hh,mm,ss,sss 天,小时，分，秒，毫秒
      let dateDiff = (endTime.getTime() - startTime.getTime()) / 1000;
      if (!isRun) {
        let timeOut = setInterval(() => {
          dateDiff--
          if (dateDiff < 0) {
            el.innerText = "";
            callback && callback();
            isRun = false;
            clearInterval(timeOut);
          } else {
            isRun = true;
            let iDay: any = Math.floor(dateDiff / (24 * 3600));
            iDay = iDay > 0 ? `${iDay}天` : "";

            let iHH: any = Math.floor(dateDiff % (24 * 3600) / 3600);
            iHH = iHH > 0 ? `${iHH}时` : "00时";

            let imm: any = Math.floor(dateDiff % (24 * 3600) % 3600 / 60);
            imm = imm > 0 ? `${imm}分` : "00分";

            let iss: any = Math.floor(dateDiff % (24 * 3600) % 3600 % 60);
            iss = iss > 0 ? `${iss}秒` : "00秒";

            let text = "";
            switch (md) {
              case 'sss': { text = `${endTime.getTime() - startTime.getTime()}`; break };
              case 'ss': { text = `${iss}`; break };
              case 'mm': { text = `${imm}${iss}`; break };
              case 'hh': { text = `${iHH}${imm}${iss}`; break };
              case 'dd': { text = `${iDay}${iHH}${imm}${iss}`; break };
              default: { text = `${iDay}${iHH}${imm}${iss}`; break }
            }
            el.innerText = text;
          }
        }, 1000)
      }

    },
  })

  // 隐藏显示字符
  app.directive('hideText', {
    mounted: (el, binding, vnode) => {
      Object.keys(binding.modifiers).length === 0 && (binding.modifiers.name = true);
      if (binding.modifiers.mobile) {
        // 手机号码
        el.innerText = el.innerText.replace(/^(\d{3})\d+(\d{4})$/, '$1****$2');
      } else if (binding.modifiers.name) {
        // 姓名 两个字隐藏后一个，两个字以上隐藏中间
        el.innerText = el.innerText.length > 2 ? el.innerText.replace(/^(\S{1})\S+(\S{1})/, '$1*$2') : el.innerText.substring(0, 1) + '*';
      } else if (binding.modifiers.idcard) {
        //身份证
        el.innerText = el.innerText.replace(/^(\d{6})\d+(\d{4})$/, '$1********$2');
      }
    }
  })
  // 复制内容
  app.directive('copy', {
    beforeMount(el, binding) {
      el.targetContent = binding.value;
      el.addEventListener('click', () => {
        if (!el.targetContent) return console.warn('没有需要复制的目标内容');
        // 创建textarea标签
        const textarea = document.createElement('textarea');
        // 设置相关属性
        textarea.readOnly = true;
        textarea.style.position = 'fixed';
        textarea.style.top = '-99999px';
        // 把目标内容赋值给它的value属性
        textarea.value = el.targetContent;
        // 插入到页面
        document.body.appendChild(textarea);
        // 调用onselect()方法
        textarea.select();
        // 把目标内容复制进剪贴板, 该API会返回一个Boolean
        const res = document.execCommand('Copy');
        // 移除textarea标签
        document.body.removeChild(textarea);
        msg({ message: '复制成功', type: "success" })
      })
    },
    updated(el, binding) {
      // 实时更新最新的目标内容
      el.targetContent = binding.value;
    },
    unmounted(el) {
      el.removeEventListener('click', () => { })
    }
  })

  // 打开新链接 v-href.blank v.href.top v.href 使用方法
  app.directive('href', {
    beforeMount(el, binding) {
      el.addEventListener('click', () => {
        let af = document.createElement("a");
        document.body.appendChild(af);
        af.href = binding.value;
        if (binding.modifiers.blank) {
          af.target = '_blank';
        }
        af.click();
        document.body.removeChild(af);
      })
    },
    unmounted(el) {
      el.removeEventListener('click', () => { })
    }
  })

  app.directive('move', {
    mounted(el) {
      el.onmousedown = e => {
        // 算出鼠标相对元素的位置
        let disX = e.clientX - el.offsetLeft
        let disY = e.clientY - el.offsetTop
        document.onmousemove = e => {
          // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX
          let top = e.clientY - disY
          if (left <= 0) {
            left = 3
          } else if (left >= document.body.clientWidth - el.offsetWidth) {
            left = document.body.clientWidth - el.offsetWidth - 3;
          }

          if (top <= 0) {
            top = 3
          } else if (top >= document.documentElement.clientHeight - el.offsetHeight) {
            top = document.documentElement.clientHeight - el.offsetHeight - 4;
          }
          // 移动当前元素
          el.style.left = left + 'px'
          el.style.top = top + 'px';
          el.style.position = "absolute";
        }
        document.onmouseup = () => {
          el.style.position = "";
          // 鼠标弹起来的时候不再移动
          document.onmousemove = null
          // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
          document.onmouseup = null
        }
      }

    }
  })

}