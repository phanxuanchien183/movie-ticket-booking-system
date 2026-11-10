-- 02_init_movies_and_showtimes.sql
-- Khởi tạo danh sách phim và lịch chiếu suất chiếu

CREATE TABLE IF NOT EXISTS movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration_minutes INT NOT NULL,
    poster_url VARCHAR(500),
    backdrop_url VARCHAR(500),
    trailer_url VARCHAR(500),
    genre VARCHAR(100),
    age_rating VARCHAR(10) DEFAULT 'P',
    description TEXT,
    status ENUM('NowShowing', 'ComingSoon', 'Ended') DEFAULT 'NowShowing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS showtimes (
    showtime_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    room_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    format_type VARCHAR(20) DEFAULT '2D Phụ đề',
    is_weekend_or_holiday BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

CREATE INDEX idx_showtimes_movie_time ON showtimes(movie_id, start_time);
