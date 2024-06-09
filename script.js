document.addEventListener('DOMContentLoaded', function() {
    // checkAdminLogin();
     loadCategories();
     loadFeedback();
    

});

function showAdminLogin() {
    document.getElementById('mainpage').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

function checkAdminLogin() {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        document.getElementById('admin-container').style.display = 'block';
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('user-container').style.display = 'none';
        loadCategories();
    } else {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('admin-container').style.display = 'none';
    }
}

function login() {
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    if (username === adminCredentials.username && password === adminCredentials.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('login-error').style.display = 'none';
        checkAdminLogin();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function logout() {
    localStorage.setItem('adminLoggedIn', 'false');
    checkAdminLogin();
}

function goBack() {
    document.getElementById('mainpage').style.display = 'block';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('admin-container').style.display = 'none';
    document.getElementById('user-container').style.display = 'none';
}

function loadCategories() {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    let adminCategoryList = document.getElementById('admin-category-list');
    let userCategoryList = document.getElementById('user-category-list');

    adminCategoryList.innerHTML = '';
    userCategoryList.innerHTML = '';

    categories.forEach((category, index) => {
        let li = document.createElement('li');
        li.classList.add('category-box');
        li.setAttribute('data-index', index);
        let text = document.createElement('p');
        text.textContent = category.name;
        li.appendChild(text);
        li.onclick = () => selectCategory(index);

        adminCategoryList.appendChild(li);

        let userLi = li.cloneNode(true);
        userLi.onclick = () => selectCategory(index);
        userCategoryList.appendChild(userLi);
    });
}

function addCategory() {
    let newCategory = document.getElementById('new-category').value.trim();
    if (newCategory) {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories.push({ name: newCategory, questions: [], projects: [] });
        localStorage.setItem('categories', JSON.stringify(categories));
        document.getElementById('new-category').value = '';
        loadCategories();
    } else {
        alert("Please enter a category name.");
    }
}

function showUserView() {
    document.getElementById('mainpage').style.display = 'none';
    document.getElementById('user-container').style.display = 'block';
    loadCategories();
}

function selectCategory(index) {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    let category = categories[index];

    document.getElementById('category-title').textContent = category.name;
    document.getElementById('category-content').style.display = 'block';
    loadQuestions(index);
    loadProjects(index);

    // Remove "selected" class from previously selected category, if any
    let previouslySelectedCategory = document.querySelector('.category-box.selected');
    if (previouslySelectedCategory) {
        previouslySelectedCategory.classList.remove('selected');
    }

    // Add "selected" class to the newly selected category
    let selectedCategory = document.querySelector(`.category-box[data-index="${index}"]`);
    selectedCategory.classList.add('selected');

    document.getElementById('new-question').setAttribute('data-category-index', index);
    document.getElementById('project-link').setAttribute('data-category-index', index);
    document.getElementById('project-description').setAttribute('data-category-index', index);
}

function deleteCategory() {
    let selectedCategory = document.querySelector('.category-box.selected');
    if (selectedCategory) {
        let index = parseInt(selectedCategory.getAttribute('data-index'));
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories.splice(index, 1);
        localStorage.setItem('categories', JSON.stringify(categories));
        document.getElementById('category-content').style.display = 'none';
        loadCategories();
    } else {
        alert("Please select a category to delete.");
    }
}

function loadQuestions(index) {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    let category = categories[index];
    let questionList = document.getElementById('question-list');
    questionList.innerHTML = '';

    category.questions.forEach((question, qIndex) => {
        let li = document.createElement('li');
        let pre = document.createElement('pre');
        pre.textContent = question.text;
        li.appendChild(pre);

        let replyContainer = document.createElement('div');
        replyContainer.classList.add('reply-container');
        let replyList = document.createElement('ul');
        replyList.classList.add('reply-list');
        replyList.id = `reply-list-${index}-${qIndex}`;
        let replyInput = document.createElement('input');
        replyInput.type = 'text';
        replyInput.id = `new-reply-${index}-${qIndex}`;
        replyInput.placeholder = 'Your reply';
        let replyButton = document.createElement('button');
        replyButton.textContent = 'Reply';
        replyButton.onclick = () => addReply(index, qIndex);
        replyContainer.appendChild(replyList);
        replyContainer.appendChild(replyInput);
        replyContainer.appendChild(replyButton);
        li.appendChild(replyContainer);

        questionList.appendChild(li);
        loadReplies(index, qIndex);
    });
}

function addQuestion() {
    let categoryIndex = document.getElementById('new-question').getAttribute('data-category-index');
    let newQuestion = document.getElementById('new-question').value.trim();
    if (newQuestion) {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories[categoryIndex].questions.push({ text: newQuestion, replies: [] });
        localStorage.setItem('categories', JSON.stringify(categories));
        document.getElementById('new-question').value = '';
        loadQuestions(categoryIndex);
    } else {
        alert("Please enter a question.");
    }
}

function loadReplies(categoryIndex, questionIndex) {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    let question = categories[categoryIndex].questions[questionIndex];
    let replyList = document.getElementById(`reply-list-${categoryIndex}-${questionIndex}`);
    replyList.innerHTML = '';

    question.replies.forEach(reply => {
        let li = document.createElement('li');
        li.textContent = reply;
        replyList.appendChild(li);
    });
}

function addReply(categoryIndex, questionIndex) {
    let replyInput = document.getElementById(`new-reply-${categoryIndex}-${questionIndex}`);
    let newReply = replyInput.value.trim();
    if (newReply) {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories[categoryIndex].questions[questionIndex].replies.push(newReply);
        localStorage.setItem('categories', JSON.stringify(categories));
        replyInput.value = '';
        loadReplies(categoryIndex, questionIndex);
    } else {
        alert("Please enter a reply.");
    }
}

function loadProjects(index) {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    let category = categories[index];
    let projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    category.projects.forEach(project => {
        let li = document.createElement('li');
        li.innerHTML = `<strong>Link:</strong> <a href="${project.link}" target="_blank">${project.link}</a><br><strong>Description:</strong> ${project.description}`;
        projectList.appendChild(li);
    });
}

function addProject() {
    let categoryIndex = document.getElementById('project-link').getAttribute('data-category-index');
    let projectLink = document.getElementById('project-link').value.trim();
    let projectDescription = document.getElementById('project-description').value.trim();

    if (projectLink && projectDescription) {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories[categoryIndex].projects.push({ link: projectLink, description: projectDescription });
        localStorage.setItem('categories', JSON.stringify(categories));
        document.getElementById('project-link').value = '';
        document.getElementById('project-description').value = '';
        loadProjects(categoryIndex);
    } else {
        alert("Please enter both project link and description.");
    }
}

function loadFeedback() {
    let feedback = JSON.parse(localStorage.getItem('feedback')) || [];
    let feedbackList = document.getElementById('feedback-list');
    let manageFeedbackList = document.getElementById('manage-feedback-list');
    feedbackList.innerHTML = '';
    manageFeedbackList.innerHTML = '';

    feedback.forEach((item, index) => {
        let li = document.createElement('li');
        li.textContent = item;
        feedbackList.appendChild(li);

        let manageLi = document.createElement('li');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('data-index', index);
        manageLi.appendChild(checkbox);
        manageLi.appendChild(document.createTextNode(item));
        manageFeedbackList.appendChild(manageLi);
    });
}

function addFeedback() {
    let newFeedback = document.getElementById('new-feedback').value.trim();
    if (newFeedback) {
        let feedback = JSON.parse(localStorage.getItem('feedback')) || [];
        feedback.push(newFeedback);
        localStorage.setItem('feedback', JSON.stringify(feedback));
        document.getElementById('new-feedback').value = '';
        loadFeedback();
    } else {
        alert("Please enter feedback.");
    }
}

function deleteFeedback() {
    let feedback = JSON.parse(localStorage.getItem('feedback')) || [];
    let checkboxes = document.querySelectorAll('#manage-feedback-list input[type="checkbox"]:checked');
    let indicesToDelete = Array.from(checkboxes).map(checkbox => parseInt(checkbox.getAttribute('data-index'))).sort((a, b) => b - a);

    indicesToDelete.forEach(index => feedback.splice(index, 1));
    localStorage.setItem('feedback', JSON.stringify(feedback));
    loadFeedback();
}


