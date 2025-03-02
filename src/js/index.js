import axios from "axios";
import Search from "./model/search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";

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
