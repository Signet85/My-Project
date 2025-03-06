import axios from "axios";
import Search from "./model/search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/recipe";
import List from "./model/List";
import * as listView from "./view/listView";
import like from "./model/like";
import {
  renderRecipe,
  clearRecipe,
  highlightSelectedRecipe,
} from "./view/recipeView";
import * as likesView from "./view/likesView";
import likes from "./model/like";
/**
 * Хайлтын контроллер = model ==> Controller <==View
 */
/**
 * web app төлөв
 * -Хайлтын query, үр дүн
 * - Тухайн үзүүлж байгаа жор
 * -Лайкласан жорууд
 * -Захиалж байгаа жорын найрлагууд
 */
const state = {};

const controlSearch = async () => {
  //1) Вэбээс хайлтын түлхүүр үгийг гаргаж авна
  const query = searchView.getInput();

  if (query) {
    //2) Шинээр хайлтын объектийг үүсгэж өгнө
    state.search = new Search(query);
    //3) Хайлт хийхэд зориулж интерфейсийг бэлтгэнэ.
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResultDiv);
    //4) Хайлтыг гүйцэтгэнэ
    await state.search.doSearch();
    //5) Хайлтын үр дүнг дэлгэцэнд үзүүлнэ
    clearLoader();
    if (state.search.result === undefined) alert("Хайлтаар илэрцгүй....");
    else searchView.renderRecipes(state.search.result);
  }
};
elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.pageButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const gotoPageNumber = parseInt(btn.dataset.goto, 10);
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

/**
 * Жорын контреллер
 */

const controlRecipe = async () => {
  //1. URL-аас ID-ийг салгаж авчирна
  const id = window.location.hash.replace("#", "");
  if (!state.likes) state.likes = new like();
  // URL дээр ID байгаа эсэхийг шалгана.
  if (id) {
    //2. Жорын модел үүсгэж өгнө
    state.recipe = new Recipe(id);
    //3. UI дэлгэцийг бэлтгэнэ
    clearRecipe();
    renderLoader(elements.recipeDiv);
    highlightSelectedRecipe(id);
    //4. Жороо татаж авчирна
    await state.recipe.getRecipe();
    //5. Жорыг гүйцэтгэх хугацаа болон орцыг тооцоолно
    clearLoader();
    state.recipe.calcTime();
    state.recipe.calcHuniiToo();
    //6. Жороо дэлгэцэнд гаргана.
    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
};
["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);
window.addEventListener("load", (e) => {
  //Шинээр лайк моделийг апп дөнгөж ачаалагдахад үүсгэнэ.
  if (!state.likes) state.likes = new like();
  //like цэсийг гаргах эсэхийг шийдэх
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
  // Лайкууд байвал тэдгээрийг цэсэнд нэмж байрлуулна
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

/**
 * Найрлаганы контреллер
 */
const controlList = () => {
  //Найрлаганы модел үүсгэнэ
  state.list = new List();
  //Харагдаж байсан найрлагыг дэлгэцнээс зайлуулна.
  listView.clearItems();
  //Уг модеруу одоо байгаа жорны бүх найрлагыг үүсгэнэ
  state.recipe.ingredients.forEach((n) => {
    //тухайн найрлагыг моделруу хийнэ
    const item = state.list.addItem(n);
    // Тухайн найрлагыг дэлгэцэнд гаргана.
    listView.renderItem(item);
  });
};
/**
 * Like Controller
 */
const controlLike = () => {
  //1. Лайкийн моделийг үүсгэнэ
  if (!state.likes) state.likes = new like();
  //2. Одоо харагдаж байгаа жорын ID-ийг олж авах
  const currentRecipeId = state.recipe.id;
  //3. Энэ жорыг лайкласан эсэхийг шалгах
  if (state.likes.isLiked(currentRecipeId)) {
    //4. Лайкласан бол лайкийг нь болиулна
    state.likes.deleteLike(currentRecipeId);
    // Харагдаж байгаа лайкийн цэснээс устгана
    likesView.deleteLike(currentRecipeId);
    //Like товчны харагдах байдлыг болиулна
    likesView.toggleLikeBtn(false);
  } else {
    //5. Лайклаагүй бол лайклана.

    const newLike = state.likes.addLike(
      currentRecipeId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.image_url
    );
    // Лайк цэсэнд энэ лайк оруулах
    likesView.renderLike(newLike);
    // Лайк товчны лайкласан байдлыг лайкласан болгох
    likesView.toggleLikeBtn(true);
  }
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

elements.shoppingList.addEventListener("click", (e) => {
  //клик хийсэн li элементийн data-itemid аттрибутыг ялгаж авах
  const id = e.target.closest(".shopping__item").dataset.itemid;
  //Олдсон ID-тэй орцыг моделоос устгана.
  state.list.deleteItem(id);
  // дэлгэцээс ийм ID-тэй орцыг олж устгана.
  listView.deleteItem(id);
});
