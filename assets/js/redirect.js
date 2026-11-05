// Keep query parameters and fragments when visiting an old bookmark.
const destination = document.getElementById('destination');
if (destination) {
  const url = new URL(destination.href);
  url.search = window.location.search;
  url.hash = window.location.hash;
  window.location.replace(url.href);
}
