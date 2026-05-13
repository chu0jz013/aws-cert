# DOP-C02 Mock Exam App

App quiz HTML để giả lập kỳ thi **AWS Certified DevOps Engineer - Professional (DOP-C02)**.

- **Bank 225 câu** scenario-based, phân bổ theo trọng số chính thức 6 domain
- **2 chế độ**: Exam (random 75 câu / 180 phút) hoặc Practice (toàn bộ bank, không timer)
- **Filter theo domain** để practice riêng từng domain yếu
- **Reference link** AWS docs cho mỗi câu ở màn hình kết quả

## Cấu trúc

```
quiz-app/
├── index.html          # UI: 3 màn hình start / quiz / result
├── style.css           # Styling (AWS color scheme, responsive)
├── app.js              # Logic: timer, navigation, scoring, filter
├── questions.json      # Bank 225 câu hỏi
└── README.md           # File này
```

## Cách chạy

App dùng `fetch('questions.json')` nên **PHẢI serve qua HTTP** (mở trực tiếp bằng `file://` sẽ bị CORS chặn).

### Cách đơn giản nhất — Python (có sẵn trên macOS)

```bash
python3 -m http.server 8000 --directory /Users/hai.kn/Desktop/docs/self/DOP-C02/quiz-app
```

Mở trình duyệt: <http://localhost:8000>

### Hoặc dùng Node.js

```bash
cd /Users/hai.kn/Desktop/docs/self/DOP-C02/quiz-app && npx serve .
```

### Hoặc VS Code Live Server extension

Mở `index.html` → chuột phải → "Open with Live Server".

## Tính năng

| Tính năng | Mô tả |
|-----------|-------|
| **2 modes** | **Exam**: random 75 câu theo trọng số / 180 phút / auto-submit. **Practice**: làm toàn bộ pool đã filter, không giới hạn thời gian |
| **Domain filter** | Tick các domain D1-D6 để chỉ thi/practice câu thuộc các domain đó. Hữu ích khi muốn luyện domain yếu |
| **Timer** | Đếm ngược 180 phút (chỉ Exam mode), dưới 10 phút chuyển vàng, dưới 5 phút đỏ + nhấp nháy |
| **Auto-submit** | Khi timer = 0, bài tự nộp |
| **Manual submit** | Nút Submit có confirmation, warn nếu còn câu chưa trả lời |
| **Navigation** | Previous / Next + phím mũi tên trái/phải |
| **Shuffle** | Mỗi lần bắt đầu thi sẽ random từ bank → ít trùng câu giữa các lần |
| **Multiple-answer** | Câu nhiều đáp án dùng checkbox; phải đúng TẤT CẢ key mới tính đúng |
| **Result** | Điểm tổng + circular chart, badge PASS/FAIL (mức 75%) |
| **Domain stats** | Bar chart % đúng theo từng domain, màu thay đổi theo mức |
| **Review** | Liệt kê câu với highlight đúng/sai + giải thích + **link AWS Docs**; filter All / Wrong / Correct |
| **Responsive** | Layout adapt cho mobile |

## Phân bổ bank 225 câu

| Domain | Trọng số | Số câu trong bank | Số câu/session (Exam) |
|--------|----------|-------------------|------------------------|
| D1 · SDLC Automation | 22% | 51 | 17 |
| D2 · Configuration Management & IaC | 17% | 39 | 13 |
| D3 · Resilient Cloud Solutions | 15% | 33 | 11 |
| D4 · Monitoring & Logging | 15% | 33 | 11 |
| D5 · Incident & Event Response | 14% | 33 | 11 |
| D6 · Security & Compliance | 17% | 36 | 12 |
| **Tổng** | **100%** | **225** | **75** |

Tỷ lệ giữ đúng trọng số AWS Exam Guide chính thức.

## Mở rộng bộ câu hỏi

Mở `questions.json` và thêm câu mới theo schema:

```json
{
  "id": 226,
  "domain": "SDLC Automation",
  "domainCode": "D1",
  "type": "single",
  "question": "Câu hỏi scenario...",
  "options": [
    { "key": "A", "text": "..." },
    { "key": "B", "text": "..." },
    { "key": "C", "text": "..." },
    { "key": "D", "text": "..." }
  ],
  "answer": ["A"],
  "explanation": "Giải thích vì sao A đúng và các đáp án khác sai.",
  "reference": "https://docs.aws.amazon.com/..."
}
```

Lưu ý:
- `domainCode` phải khớp 1 trong các code trong `domains` (D1-D6)
- `type` chỉ có 2 giá trị: `"single"` hoặc `"multiple"`
- `answer` luôn là array, kể cả single-answer
- `reference` là URL trỏ tới AWS docs liên quan (hiển thị ở Review screen)
- Nếu thêm câu mới, cập nhật `count` ở `domains` để summary chính xác

## Tips

- Kỳ thi thật: 75 câu / 180 phút, pass mark ~750/1000 (~75%)
- App giả lập đúng format: random 75 câu từ bank 225, giữ phân bổ theo trọng số
- Bank 225 câu đủ để làm 3+ lần Exam mode với ít trùng câu
- Practice mode: luyện theo domain yếu (vd: tick chỉ D5 → làm 33 câu D5 không timer)
- Multiple-answer: phải đúng **TẤT CẢ** đáp án, không có partial credit (giống kỳ thi thật)

## Nguồn câu hỏi

- 8 file ghi chú DOP-C02 ở thư mục cha
- Topic research từ ExamTopics, Tutorials Dojo, Reddit r/AWSCertification (chỉ tham khảo topic phổ biến, **KHÔNG copy nguyên văn** câu hỏi — vi phạm AWS Candidate Agreement)
- AWS official documentation
- Kinh nghiệm thực tế DOP-C02
