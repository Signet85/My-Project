export default class likes {
  constructor() {
    this.readDataLocalStorage();
    if (!this.likes) this.likes = [];
  }
  addLike(id, title, publisher, img) {
    const like = { id, title, publisher, img };
    this.likes.push(like);
    //Storage-руу хадгална
    this.savaDataToLocalStorage();
    return like;
  }
  deleteLike(id) {
    // id гэдэг ID-тэй like-ийг индексийг массиваас хайж олно
    const index = this.likes.findIndex((el) => el.id === id);
    // Уг индекс дээрхи элементийг массиваас устгах
    this.likes.splice(index, 1);
    //Устгасан дараа нэмж хадгална
    this.savaDataToLocalStorage();
  }
  isLiked(id) {
    // if (this.likes.findIndex(el => el.id === id) === -1) return false;
    // else return true;
    return this.likes.findIndex((el) => el.id === id) !== -1;
  }
  getNumberOfLikes() {
    return this.likes.length;
  }
  savaDataToLocalStorage() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }
  readDataLocalStorage() {
    this.likes = JSON.parse(localStorage.getItem("likes"));
  }
}
