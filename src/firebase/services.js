import firebase, { db } from "./config";

export const addDocument = (collection, data) => {
  const query = db.collection(collection);

  query.add({
    ...data,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Thời gian hiện tại trên firebase
  });
};

// search: 'Ha'
/**
 * db: collection "users"
 * {
 *  displayName: 'Nguyen Van Ha', => ['Nguyen', 'Van', 'Ha'] => sinh ra các hoán vị có thể có => ['Van', 'Nguyen', 'Ha'],...
 *  keywords: ['V', 'Va', 'Van', 'Van H', 'Van Ha', ...]
 *  ...
 * },
 * {
 *  displayName: 'Thao Huynh'
 *  ...
 * }
 */
// Tao keywords cho displayName, su dung cho search
export const generateKeywords = (displayName) => {
  // liet ke tat cac hoan vi. vd: name = ["Nguyen", "Van", "Ha"]
  // => ["Ha", "Van", "Nguyen"], ["Ha", "Nguyen", "Van"], ["Nguyen", "Ha", "Van"],...
  const name = displayName.split(" ").filter((word) => word);

  const length = name.length;
  let flagArray = [];
  let result = [];
  let stringArray = [];

  /**
   * khoi tao mang flag false
   * dung de danh dau xem gia tri
   * tai vi tri nay da duoc su dung
   * hay chua
   **/
  for (let i = 0; i < length; i++) {
    flagArray[i] = false;
  }

  const createKeywords = (name) => {
    const arrName = [];
    let curName = "";
    name.split("").forEach((letter) => {
      curName += letter;
      arrName.push(curName);
    });
    return arrName;
  };

  function findPermutation(k) {
    for (let i = 0; i < length; i++) {
      if (!flagArray[i]) {
        flagArray[i] = true;
        result[k] = name[i];

        if (k === length - 1) {
          stringArray.push(result.join(" "));
        }

        findPermutation(k + 1);
        flagArray[i] = false;
      }
    }
  }

  findPermutation(0);

  const keywords = stringArray.reduce((acc, cur) => {
    const words = createKeywords(cur);
    return [...acc, ...words];
  }, []);

  return keywords;
};
