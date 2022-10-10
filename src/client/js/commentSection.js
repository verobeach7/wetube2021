import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
let deleteBtns = document.querySelectorAll("#deleteCommentBtn");

const handleDelete = async (event) => {
  // 부모노드를 가져오는 방법
  const li = event.srcElement.parentNode;
  const {
    dataset: { id },
  } = li;
  await fetch(`/api/comment/${id}`, {
    method: "DELETE",
  });
  li.remove();
};

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const div = document.createElement("div");
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fas fa-trash-can";
  deleteIcon.id = "deleteCommentBtn";
  div.appendChild(icon);
  div.appendChild(span);
  newComment.appendChild(div);
  newComment.appendChild(deleteIcon);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text.trim() === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    // express에게 json으로 보낼 것이라는 것을 반드시 알려야 함. 헤더에 포함시키지 않으면 텍스트를 보내는 것으로 인식함.
    headers: {
      "Content-Type": "application/json",
    },
    // 프론트엔드에서 JSON.stringify를 사용하여 string으로 구성해줌, 백엔드에서 string을 받아 JS object로 바꿔서 사용함
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
    deleteBtns = document.querySelectorAll("#deleteCommentBtn");
    deleteBtns.forEach((deleteBtn) => {
      deleteBtn.addEventListener("click", handleDelete);
    });
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (deleteBtns) {
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", handleDelete);
  });
}
