// script.js

// Hàm tiện ích để lấy tham số từ URL (ví dụ: ?id=1 -> lấy được số 1)
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// === LOGIC CHO TRANG CHỦ (INDEX) ===
if (document.getElementById('page-library')) {
    const state = { query: '', genre: 'all' };
    const grid = document.getElementById('books-grid');
    const countLabel = document.getElementById('results-count');
    
    // Render bộ lọc thể loại
    const genres = ['all', ...new Set(mockBooks.map(b => b.genre))];
    const genreContainer = document.getElementById('genre-container');
    
    genreContainer.innerHTML = genres.map(g => 
        `<button class="genre-btn ${g === 'all' ? 'active' : ''}" data-genre="${g}">
            ${g.charAt(0).toUpperCase() + g.slice(1)}
        </button>`
    ).join('');

    // Xử lý sự kiện click vào thể loại
    document.querySelectorAll('.genre-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.genre = e.target.dataset.genre;
            renderBooks();
        });
    });

    // Xử lý tìm kiếm
    document.getElementById('search-input').addEventListener('input', (e) => {
        state.query = e.target.value.toLowerCase();
        renderBooks();
    });

    function renderBooks() {
        const filtered = mockBooks.filter(book => {
            const matchSearch = book.title.toLowerCase().includes(state.query) || 
                                book.author.toLowerCase().includes(state.query);
            const matchGenre = state.genre === 'all' || book.genre === state.genre;
            return matchSearch && matchGenre;
        });

        countLabel.textContent = `Tìm thấy ${filtered.length} cuốn sách`;

        grid.innerHTML = filtered.map(book => `
            <a href="book-details.html?id=${book.id}" class="book-card">
                <img src="${book.cover}" class="book-cover" alt="${book.title}">
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <span class="badge">${book.genre}</span>
                </div>
            </a>
        `).join('');
    }

    // Chạy lần đầu
    renderBooks();
}

// === LOGIC CHO TRANG CHI TIẾT (DETAILS) ===
if (document.getElementById('page-details')) {
    const bookId = getQueryParam('id');
    const book = mockBooks.find(b => b.id === bookId);
    const container = document.getElementById('details-content');

    if (!book) {
        container.innerHTML = '<p style="text-align: center">Không tìm thấy sách!</p>';
    } else {
        container.innerHTML = `
            <div class="details-layout">
                <img src="${book.cover}" class="details-cover" alt="${book.title}">
                <div class="details-info">
                    <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">${book.title}</h1>
                    <p style="color: #525252; font-size: 1.1rem;">Tác giả: ${book.author}</p>
                    
                    <div class="details-stats">
                        <span><i class="fa-regular fa-file-lines"></i> ${book.pages} trang</span>
                        <span><i class="fa-regular fa-calendar"></i> ${book.publishedYear}</span>
                        <span class="badge" style="background: #dbeafe; color: #1e40af;">${book.genre}</span>
                    </div>

                    <h3 style="margin-bottom: 0.5rem;">Giới thiệu</h3>
                    <p style="color: #404040; line-height: 1.6; margin-bottom: 2rem;">${book.description}</p>

                    <a href="read-book.html?id=${book.id}" class="btn btn-primary">
                        <i class="fa-solid fa-book-open"></i> Đọc ngay
                    </a>
                </div>
            </div>
        `;
    }
}

// === LOGIC CHO TRANG ĐỌC SÁCH (READER) ===
if (document.getElementById('page-reader')) {
    const bookId = getQueryParam('id');
    const book = mockBooks.find(b => b.id === bookId);
    
    if (!book) {
        alert('Sách không tồn tại!');
        window.location.href = 'index.html';
    } else {
        // Cập nhật link quay lại
        document.getElementById('back-link').href = `book-details.html?id=${bookId}`;
        document.getElementById('book-title-header').textContent = book.title;

        let currentPage = 0;
        const totalPages = book.content.length;
        const contentEl = document.getElementById('reader-text');
        const indicator = document.getElementById('page-indicator');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const slider = document.getElementById('page-slider');

        slider.max = totalPages - 1;

        function renderPage() {
            // Hiển thị nội dung
            const paragraphs = book.content[currentPage].split('\n').map(p => `<p>${p}</p>`).join('');
            contentEl.innerHTML = paragraphs;
            
            // Cập nhật giao diện
            indicator.textContent = `Trang ${currentPage + 1} / ${totalPages}`;
            slider.value = currentPage;
            prevBtn.disabled = currentPage === 0;
            nextBtn.disabled = currentPage === totalPages - 1;
            
            // Cuộn lên đầu trang
            window.scrollTo(0, 0);
        }

        // Xử lý sự kiện nút bấm
        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                renderPage();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                renderPage();
            }
        });

        slider.addEventListener('input', (e) => {
            currentPage = parseInt(e.target.value);
            renderPage();
        });

        // Chạy lần đầu
        renderPage();
    }
}