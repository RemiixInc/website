var emojisString =
  "😀 😃 😄 😁 😆 😅 😂 🤣 🥲 ☺️ 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃";
var emojis = emojisString.split(" ");
var emoji = emojis[Math.floor(Math.random() * emojis.length)];
document.getElementById("emoji").innerHTML = emoji + "&nbsp;";

fetch("https://dev.to/feed/rmx")
  .then(res => res.text())
  .then(xml => {
    const json = xmlToJson.parse(xml);
    var posts = json.rss.channel.item;
    if (!posts.length) posts = [posts];
    var element = document.getElementById("posts");
    var i;
    for (i = 0; i < posts.length; i++) {      
      const desc = posts[i].description.replace(/<(.|\n)*?>/g, "");    
      element.innerHTML += `<a href="${
        posts[i].link
      }" target="_blank" rel="noopener"><button class="accent block inline">${
        posts[i].title
      }</button></a><button class="block inline fixed">${posts[
        i
      ].pubDate.substring(0, 16)}</button><p class="description">${desc
        .substring(0, desc.indexOf(' ', 300))}... <a href="${
        posts[i].link
      }" target="_blank" rel="noopener" class="read">Read more</a></p>${parseTags(
        posts[i].category
      )}<br /><br />`;
    }
  });

function parseTags(tags) {
  var i;
  var result = "";
  for (i = 0; i < tags.length; i++) {
    result += `<a class="tag" href="https://dev.to/t/${tags[i]}" target="_blank" rel="noopener"><span class="hash">#</span>${tags[i]}</a> `;
  }
  return result;
}