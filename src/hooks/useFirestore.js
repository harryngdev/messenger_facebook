import React, { useState } from "react";
import { db } from "../firebase/config";

/**
 * Lưu ý: Không lấy ra tất cả dữ liệu trong Collection từ firebase trả về client => Sử dụng câu điều kiệu Where khi query collection
 * Sử dụng 2 Parameter cuar useFireStore: collection, condition (câu điều kiện khi query collection)
 */
const useFireStore = (collection, condition) => {
  const [documents, setDocuments] = useState([]);

  /**
   * Để lắng nghe sự kiện khi collection users trong firebase thay đổi => onSnapshot(): khi có sự thay đổi trong collection đoạn code trong onSnapshot sẽ được thực thi ở client
   * Vì là một Side Effect nên cần được viết trong ReactHooks useEffect
   */
  React.useEffect(() => {
    let collectionRef = db.collection(collection).orderBy("createdAt");

    /**
     * condition {
     *  fieldName: 'abc',
     *  operator: '==', (in nếu value là array)
     *  compareValue: 'bca'
     * }
     */
    if (condition) {
      /**
       * firestore không chấp nhận compareValue là null hay empty array
       */
      if (!condition.compareValue || !condition.compareValue.length) {
        /**
         * Rest documents data
         */
        setDocuments([]);
        return;
      }

      collectionRef = collectionRef.where(
        condition.fieldName,
        condition.operator,
        condition.compareValue
      );
    }

    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      /**
       * snapshot: dữ liệu thuần từ firestore (dữ liệu cần lấy trong filed docs)
       * doc.data(): function firestore có sẵn để lấy được dữ liệu từ filed docs, covert data firestore thành 1 data object
       */
      const documents = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setDocuments(documents);
    });

    /**
     * Khi collection hay condition thay đổi thì unsubscribe sẽ được thực thi trước (hủy collection trước và lắng nghe collection mới)
     */
    return unsubscribe;
  }, [collection, condition]);

  return documents;
};

export default useFireStore;
