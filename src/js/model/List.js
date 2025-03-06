import { uniq } from "lodash";
import uniqid from "uniqid";
export default class List {
  constructor() {
    this.items = [];
  }
  deleteItem(id) {
    // id гэдэг ID-тэй орцын индексийг массиваас хайж олно
    const index = this.items.findIndex((el) => el.id === id);
    // Уг индекс дээрхи элементийг массиваас устгах
    this.items.splice(index, 1);
  }
  addItem(item) {
    let newItem = {
      id: uniqid(),
      //item:item;
      item,
    };
    this.items.push(newItem);
    return newItem;
  }
}
