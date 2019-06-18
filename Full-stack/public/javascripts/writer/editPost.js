var quill = new Quill('#editor', {
  theme: 'snow'
});

$('.flexdatalist').flexdatalist({
  minLength: 1
});

CKEDITOR.replace('editor', {
  "extraPlugins": 'imagebrowser',
  "imageBrowser_listUrl": "/actions/files"
});

CKEDITOR.config.height = "500";

$('.container_input').click(function () {
  $('.container_input input:checked').prop('checked', false);

  $(this).children('input').prop('checked', true);

  const parentId = $(this).attr('parentId');
  if (parentId) {
    $(`#${parentId}`).children('input').prop('checked', true);
  }
});
$('#cancel_Edit_Article-btn').click(function () {
  window.location = "/writer/posts-denied";
})
const getArticleCategories = () => {
  let result = [];
  const categoryListElm = $("#edit_article__categories-input input:checked").parent();

  for (let categoryElm of categoryListElm) {
    result.push(categoryElm.id);
  }

  return result;
}
const getArticleCoverImage = (content) => {
  const contentElms = $(content);
  const coverImage = $('img:first-child', contentElms).attr('src');

  return coverImage;
}
$('#save_Edit_Article-btn').click(function (e) {
  e.preventDefault();

  const content = CKEDITOR.instances.editor.getData();
  const title = $('#article__title-input').val().trim();
  const abstract = $('#article__abstract-input').val().trim();
  const categories = getArticleCategories();
  const coverImage = getArticleCoverImage(content);
  const tagListInput = $('.flexdatalist').flexdatalist('value');
  const reason = "";
  let tagListOld = [];
  let tagListNew = [];
  let idSelect;
  for (let tag of tagListInput) {
    idSelect = $('#edit_tagList').find('option').filter(function () {
      return $(this).html() === tag
    }).val();

    if (idSelect) {
      tagListOld.push(idSelect)
    } else {
      tagListNew.push(tag);
    }
  }

  console.log(`title: ${title}.`);
  console.log(`abstract: ${abstract}.`);
  console.log(`tagListOld: ${tagListOld}.`);
  console.log(`tagListNew: ${tagListNew}.`);
  console.log(`categories: ${categories}.`);
  console.log(`coverImage: ${coverImage}.`);
  console.log(`content: ${content}.`);

  const isInvalid = !title || !abstract || !categories.length || !coverImage || !content;

  if (isInvalid) {
    console.log("isInvalid: ", isInvalid);
    return;
  }

  postData('/api/article/update', { title, abstract, tagListOld, tagListNew, categories, coverImage, content, reasondenied: reason })
    .then(res => {
      const statusCode = res.status;

      switch (statusCode) {
        case 200:
          res.json().then(article => {
            console.log(article);
            showSuccessModal($(this), 'Edited post successfully.');
            window.location = "/writer/posts-denied";
          })

          break;
        case 500:
          showErrorsModal($(this), 'Server Error. Please try again!');
          break;

        default:
          res.json().then(err => {
            console.log(err);
          })
          break;
      }
    })
    .catch(err => {
      console.log(err);
    })

})