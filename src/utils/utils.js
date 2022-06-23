// eslint-disable-next-line

// 6-20位的密码，包含大写字母、小写字母、数字和特殊字符
const generalPassword = (legnth = 10) => {
  let pass = '';
  const seed = ['@', '#', '%', '^', '&', '?', '_'];

  // 定义获取密码成员的方法
  const getNumber = () => Math.floor(Math.random() * 10); // 0~9的数字
  const getUpLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65); // A-Z
  const getLowLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97); // a-z
  const getStr = () => seed[Math.floor(Math.random() * seed.length)];

  // 将获取成员的方法保存在一个数组中方便用后面生成的随机index取用
  const passMethodArr = [getNumber, getUpLetter, getLowLetter, getStr];

  // 随机index
  const getIndex = () => Math.floor(Math.random() * 4);

  // 从0-9，a-z，A-Z，特殊字符中随机获取一项
  const getPassItem = () => passMethodArr[getIndex()]();

  // 不多解释
  Array(legnth - 4)
    .fill('')
    .forEach(() => {
      pass = pass + getPassItem();
    });

  const confirmItem = [getNumber(), getUpLetter(), getLowLetter(), getStr()];

  // 加上我们确认的三项，从而使生成的密码，大写字母、小写字母和数字至少各包含一个

  for (const iterator of confirmItem) {
    pass = pass + iterator;
  }

  return pass;
};

export { generalPassword };
