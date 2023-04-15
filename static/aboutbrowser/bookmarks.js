BOOKMARK_TEMPLATE = '<div class="bookmarksRow"><div class="bookmarksIconDiv"><img src="/aboutbrowser/darkfavi.png" class="bookmarksIcon"></img></div><input class="bookmarkTitle"></input><input class="bookmarkUrl"></input><div class="bookmarkButtons"><button class="navbarBtn" id="deleteBtn"><i class="fa-solid fa-trash-can"></i></button></div></div>'
// background-color:color-mix(in srgb, #8caaee 75%, #292c3c); color:#292c3c;


/*
    save(localStorageKey = "bookmarks") {
        var localStorageData = [];
        for (const bookmark of this.bookmarkContainer.childNodes) {
            localStorageData.push({ name: bookmark.childNodes[1].data, url: bookmark.dataset.url })
        }
        localStorage.setItem(localStorageKey, JSON.stringify(localStorageData));
    }

    load(localStorageKey = "bookmarks") {
        var localStorageData = this.archive(localStorageKey);
        for (const bookmark of localStorageData) {
            this.add(bookmark.name, bookmark.url);
        }
    }
 */
var bookmarksTable = document.querySelector("#bookmarksTable");
var localStorageData = JSON.parse(localStorage.getItem("bookmarks"));

currentlySelectedBookmark = null;

function onclickBookmark(event) {
    el = event.currentTarget;
    if(currentlySelectedBookmark) {
        currentlySelectedBookmark.style.removeProperty("background-color");
        currentlySelectedBookmark.querySelector(".bookmarkTitle").style.removeProperty("color");
        currentlySelectedBookmark.querySelector(".bookmarkUrl").style.removeProperty("color");
    }
    currentlySelectedBookmark = el;
    el.style.backgroundColor = "color-mix(in srgb, #8caaee 75%, #292c3c)";
    el.querySelector(".bookmarkTitle").style.color = "#292c3c";
    el.querySelector(".bookmarkUrl").style.color = "#292c3c";
}

function init() {
    localStorageData.forEach(function (bookmark, i) {
        addBookmark(bookmark.name, bookmark.url, i)
    });
}

function save() {
    localStorage.setItem("bookmarks", JSON.stringify(localStorageData));
}

function addBookmark(title, url, i) {
    el = htmlToElement(BOOKMARK_TEMPLATE);
    el.setAttribute("data-index", i);
    el.querySelector(".bookmarkTitle").value = title;
    el.querySelector(".bookmarkUrl").value = url;
    el.querySelector("#deleteBtn").onclick = deleteBookmark;
    el.querySelector(".bookmarkTitle").addEventListener("blur", updateBookmark);
    el.querySelector(".bookmarkUrl").addEventListener("blur", updateBookmark);
    el.onclick = onclickBookmark;
    bookmarksTable.appendChild(el);
}

function deleteBookmark(event) {
    bookmarkEl = event.currentTarget.parentElement.parentElement;
    index = bookmarkEl.getAttribute("data-index");
    localStorageData.splice(index, 1);
    save();
    sendMessage({type: "reloadBookmarks"});
    reloadBookmarks();
}

function updateBookmark(event) {
    bookmarkEl = event.currentTarget.parentElement;
    title = bookmarkEl.querySelector(".bookmarkTitle").value;
    url = bookmarkEl.querySelector(".bookmarkUrl").value;
    index = bookmarkEl.getAttribute("data-index");
    localStorageData[index].name = title;
    localStorageData[index].url = url;
    save();
    sendMessage({type: "reloadBookmarks"});
}

function reloadBookmarks() {
    localStorageData = JSON.parse(localStorage.getItem("bookmarks"));
    bookmarksTable.innerHTML = '';
    init();
}

function reloadBookmarksCallback() {
    reloadBookmarks();
}
