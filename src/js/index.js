import axios from "axios";
import Search from "./model/search";

let search = new Search("Pasta");
search.doSearch().then((r) => console.log(r));
