const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text.trim() === "") {
    return;
  }
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    // express에게 json으로 보낼 것이라는 것을 반드시 알려야 함. 헤더에 포함시키지 않으면 텍스트를 보내는 것으로 인식함.
    headers: {
      "Content-Type": "application/json",
    },
    // 프론트엔드에서 JSON.stringify를 사용하여 string으로 구성해줌, 백엔드에서 string을 받아 JS object로 바꿔서 사용함
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
