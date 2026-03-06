-- ============================================================
-- College Fest - Seed Data (50+ records per table)
-- seed.sql
-- ============================================================

USE college_fest;

-- Categories
INSERT INTO Category (name, description) VALUES
('Music', 'Battle of bands, solo singing, DJ nights'),
('Dance', 'Classical, western, group performances'),
('Tech', 'Hackathons, coding challenges, robotics'),
('Art', 'Painting, sculpture, digital art'),
('Sports', 'Indoor and outdoor competitions'),
('Drama', 'Street play, mono act, skit'),
('Literary', 'Debate, quiz, creative writing'),
('Photography', 'Portrait, landscape, street photography');

-- Students (50 records) with password = 'password123' (bcrypt hash placeholder)
INSERT INTO Student (name, email, password_hash, department, year, phone, role) VALUES
('Aarav Sharma', 'aarav.sharma@college.edu', '$2a$10$examplehash1aarav', 'Computer Science', 2, '9876543201', 'student'),
('Ananya Patel', 'ananya.patel@college.edu', '$2a$10$examplehash2ananya', 'Electronics', 3, '9876543202', 'student'),
('Arjun Mehta', 'arjun.mehta@college.edu', '$2a$10$examplehash3arjun', 'Mechanical', 1, '9876543203', 'student'),
('Bhavya Singh', 'bhavya.singh@college.edu', '$2a$10$examplehash4bhavya', 'Civil', 4, '9876543204', 'student'),
('Chetan Kumar', 'chetan.kumar@college.edu', '$2a$10$examplehash5chetan', 'IT', 2, '9876543205', 'student'),
('Deepika Rao', 'deepika.rao@college.edu', '$2a$10$examplehash6deepika', 'Computer Science', 3, '9876543206', 'student'),
('Eshan Gupta', 'eshan.gupta@college.edu', '$2a$10$examplehash7eshan', 'Electronics', 2, '9876543207', 'student'),
('Fatima Khan', 'fatima.khan@college.edu', '$2a$10$examplehash8fatima', 'Biotechnology', 1, '9876543208', 'student'),
('Gaurav Joshi', 'gaurav.joshi@college.edu', '$2a$10$examplehash9gaurav', 'IT', 4, '9876543209', 'student'),
('Harini Nair', 'harini.nair@college.edu', '$2a$10$examplehash10harini', 'Computer Science', 2, '9876543210', 'student'),
('Ishaan Verma', 'ishaan.verma@college.edu', '$2a$10$examplehash11ishaan', 'Mechanical', 3, '9876543211', 'student'),
('Jasmine Pillai', 'jasmine.pillai@college.edu', '$2a$10$examplehash12jasmine', 'Civil', 1, '9876543212', 'student'),
('Karan Bansal', 'karan.bansal@college.edu', '$2a$10$examplehash13karan', 'Electronics', 4, '9876543213', 'student'),
('Lavanya Iyer', 'lavanya.iyer@college.edu', '$2a$10$examplehash14lavanya', 'Biotechnology', 2, '9876543214', 'student'),
('Manish Tyagi', 'manish.tyagi@college.edu', '$2a$10$examplehash15manish', 'IT', 3, '9876543215', 'student'),
('Neha Agarwal', 'neha.agarwal@college.edu', '$2a$10$examplehash16neha', 'Computer Science', 1, '9876543216', 'student'),
('Om Prakash', 'om.prakash@college.edu', '$2a$10$examplehash17om', 'Mechanical', 4, '9876543217', 'student'),
('Priya Chatterjee', 'priya.chatterjee@college.edu', '$2a$10$examplehash18priya', 'Electronics', 2, '9876543218', 'student'),
('Rahul Mishra', 'rahul.mishra@college.edu', '$2a$10$examplehash19rahul', 'Civil', 3, '9876543219', 'student'),
('Sanya Kapoor', 'sanya.kapoor@college.edu', '$2a$10$examplehash20sanya', 'Biotechnology', 1, '9876543220', 'student'),
('Tarun Srivastava', 'tarun.srivastava@college.edu', '$2a$10$examplehash21tarun', 'IT', 4, '9876543221', 'student'),
('Uma Devi', 'uma.devi@college.edu', '$2a$10$examplehash22uma', 'Computer Science', 2, '9876543222', 'student'),
('Vikram Pandey', 'vikram.pandey@college.edu', '$2a$10$examplehash23vikram', 'Mechanical', 3, '9876543223', 'student'),
('Warda Hussain', 'warda.hussain@college.edu', '$2a$10$examplehash24warda', 'Electronics', 1, '9876543224', 'student'),
('Yash Malhotra', 'yash.malhotra@college.edu', '$2a$10$examplehash25yash', 'Civil', 4, '9876543225', 'student'),
('Zara Ahmed', 'zara.ahmed@college.edu', '$2a$10$examplehash26zara', 'Biotechnology', 2, '9876543226', 'student'),
('Aditya Raj', 'aditya.raj@college.edu', '$2a$10$examplehash27aditya', 'IT', 3, '9876543227', 'student'),
('Bindu Krishnan', 'bindu.krishnan@college.edu', '$2a$10$examplehash28bindu', 'Computer Science', 1, '9876543228', 'student'),
('Chirag Desai', 'chirag.desai@college.edu', '$2a$10$examplehash29chirag', 'Mechanical', 4, '9876543229', 'student'),
('Divya Reddy', 'divya.reddy@college.edu', '$2a$10$examplehash30divya', 'Electronics', 2, '9876543230', 'student'),
('Ekta Choudhary', 'ekta.choudhary@college.edu', '$2a$10$examplehash31ekta', 'Civil', 3, '9876543231', 'student'),
('Farhan Qureshi', 'farhan.qureshi@college.edu', '$2a$10$examplehash32farhan', 'Biotechnology', 1, '9876543232', 'student'),
('Geeta Bhatt', 'geeta.bhatt@college.edu', '$2a$10$examplehash33geeta', 'IT', 4, '9876543233', 'student'),
('Hitesh Anand', 'hitesh.anand@college.edu', '$2a$10$examplehash34hitesh', 'Computer Science', 2, '9876543234', 'student'),
('Ira Saxena', 'ira.saxena@college.edu', '$2a$10$examplehash35ira', 'Mechanical', 3, '9876543235', 'student'),
('Jayant Tripathi', 'jayant.tripathi@college.edu', '$2a$10$examplehash36jayant', 'Electronics', 1, '9876543236', 'student'),
('Kavya Shetty', 'kavya.shetty@college.edu', '$2a$10$examplehash37kavya', 'Civil', 4, '9876543237', 'student'),
('Lokesh Goyal', 'lokesh.goyal@college.edu', '$2a$10$examplehash38lokesh', 'Biotechnology', 2, '9876543238', 'student'),
('Meera Jain', 'meera.jain@college.edu', '$2a$10$examplehash39meera', 'IT', 3, '9876543239', 'student'),
('Nandini Pillai', 'nandini.pillai@college.edu', '$2a$10$examplehash40nandini', 'Computer Science', 1, '9876543240', 'student'),
('Omkar Patil', 'omkar.patil@college.edu', '$2a$10$examplehash41omkar', 'Mechanical', 4, '9876543241', 'student'),
('Pallavi Shah', 'pallavi.shah@college.edu', '$2a$10$examplehash42pallavi', 'Electronics', 2, '9876543242', 'student'),
('Quantin Ferreira', 'quantin.ferreira@college.edu', '$2a$10$examplehash43quantin', 'Civil', 3, '9876543243', 'student'),
('Riya Menon', 'riya.menon@college.edu', '$2a$10$examplehash44riya', 'Biotechnology', 1, '9876543244', 'student'),
('Siddharth Das', 'siddharth.das@college.edu', '$2a$10$examplehash45siddharth', 'IT', 4, '9876543245', 'student'),
('Tanvi Kulkarni', 'tanvi.kulkarni@college.edu', '$2a$10$examplehash46tanvi', 'Computer Science', 2, '9876543246', 'student'),
('Uday Bose', 'uday.bose@college.edu', '$2a$10$examplehash47uday', 'Mechanical', 3, '9876543247', 'student'),
('Varsha Nandan', 'varsha.nandan@college.edu', '$2a$10$examplehash48varsha', 'Electronics', 1, '9876543248', 'student'),
('Waseem Ali', 'waseem.ali@college.edu', '$2a$10$examplehash49waseem', 'Civil', 4, '9876543249', 'student'),
('Xerxes Patel', 'xerxes.patel@college.edu', '$2a$10$examplehash50xerxes', 'Biotechnology', 2, '9876543250', 'student'),
('admin', 'admin@college.edu', '$2a$10$examplehashadmin', 'Administration', 1, '9876543000', 'admin');

-- Events (20 events across categories)
INSERT INTO Event (name, description, category_id, date, time, venue, max_participants, prize_pool, status) VALUES
('Battle of Bands', 'Assemble your band and battle it out on stage with original compositions or covers. Judged on musicality, stage presence, and crowd engagement. Top 3 bands win cash prizes and recording studio time.', 1, '2026-03-15', '18:00:00', 'Main Auditorium', 20, '₹50,000', 'upcoming'),
('Solo Singing Championship', 'Open-mic style solo singing competition across all genres — Bollywood, indie, classical, and western. Two knockout rounds followed by a grand finale with a live audience vote.', 1, '2026-03-16', '14:00:00', 'Open Amphitheatre', 50, '₹20,000', 'upcoming'),
('Western Dance Showdown', 'High-energy western dance face-off featuring hip-hop, contemporary, freestyle, and K-pop. Solo or duo entries. Choreography, synchronization, and creativity are key scoring criteria.', 2, '2026-03-15', '16:00:00', 'Cultural Hall', 30, '₹30,000', 'upcoming'),
('Classical Dance Recital', 'Celebrate India''s rich dance heritage through Bharatanatyam, Kathak, Odissi, and other classical forms. Performances judged on technique, expression (abhinaya), and costume presentation.', 2, '2026-03-16', '10:00:00', 'Cultural Hall', 25, '₹25,000', 'upcoming'),
('24hr Hackathon: Code for Change', 'A marathon 24-hour coding challenge where teams of 2–4 build real-world solutions around the theme "Sustainable Campus." Mentors from top tech companies. Prizes include internship offers and cash awards.', 3, '2026-03-14', '09:00:00', 'CS Lab Block', 100, '₹1,00,000', 'upcoming'),
('Competitive Coding Arena', 'Test your algorithmic skills in a timed competitive programming contest on HackerRank. Problems range from easy to expert level. Individual participation only. Top 10 get certificates and prizes.', 3, '2026-03-15', '10:00:00', 'IT Lab', 60, '₹40,000', 'upcoming'),
('Robotics Rumble', 'Design and demonstrate autonomous or remote-controlled robots in obstacle courses, sumo rings, and line-follower tracks. Cash prizes plus sponsorship for top 3 projects to attend national competitions.', 3, '2026-03-16', '11:00:00', 'Mechanical Workshop', 30, '₹60,000', 'upcoming'),
('Canvas & Colors: Paint-Off', 'Live painting competition where participants create original artwork on a given theme within 3 hours. All mediums allowed — watercolour, acrylic, oil, and mixed media. Winning pieces displayed in campus gallery.', 4, '2026-03-15', '09:00:00', 'Art Studio', 40, '₹15,000', 'upcoming'),
('Lens & Light: Photo Walk', 'A guided photography walk through campus exploring themes of architecture, nature, and daily life. Submit your 5 best shots for judging. Awards for Best Composition, Best Story, and People''s Choice.', 8, '2026-03-14', '07:00:00', 'Campus Grounds', 35, '₹20,000', 'upcoming'),
('Futsal Fiesta', 'Fast-paced 5-a-side indoor football tournament with group stages, quarter-finals, semis, and a final under floodlights. Register your squad of 7 (5 + 2 subs). Referees provided. Trophy plus cash prizes for top 2 teams.', 5, '2026-03-14', '08:00:00', 'Sports Complex', 80, '₹35,000', 'upcoming'),
('Table Tennis Clash', 'Singles and doubles table tennis championship played under ITTF rules. Round-robin group stage followed by single-elimination knockouts. Medals plus prize money for winners and runners-up.', 5, '2026-03-15', '09:00:00', 'Indoor Sports Hall', 32, '₹10,000', 'upcoming'),
('Nukkad Natak: Street Play', 'Powerful street theatre performances on social issues including climate change, mental health, and digital awareness. Teams of 8–15 perform 20-minute acts. Judged on message impact, acting, and audience engagement.', 6, '2026-03-16', '15:00:00', 'Open Air Theatre', 10, '₹20,000', 'upcoming'),
('Mono Act Challenge', 'Solo theatrical performances — comedy, tragedy, or satire. Each performer gets 10 minutes on stage. Express a full narrative through voice modulation, body language, and emotional depth.', 6, '2026-03-15', '14:00:00', 'Main Auditorium', 20, '₹15,000', 'upcoming'),
('Parliamentary Debate', 'Oxford-style parliamentary debate on current affairs and ethical dilemmas. Teams of 2 argue for or against motions. Judged on argumentation, rebuttals, and eloquence. Winning team gets trophies and book vouchers.', 7, '2026-03-14', '10:00:00', 'Seminar Hall A', 30, '₹15,000', 'upcoming'),
('Quizmania: The Ultimate Quiz Bowl', 'A multi-round general knowledge quiz covering science, pop culture, sports, history, and current affairs. Teams of 3 compete through written prelims, buzzer rounds, and rapid-fire finals.', 7, '2026-03-15', '11:00:00', 'Seminar Hall B', 50, '₹20,000', 'upcoming'),
('Ink & Imagination: Creative Writing', 'Express yourself through prose, poetry, or micro-fiction. Participants write on surprise prompts revealed at the venue. Entries judged on originality, language, and emotional resonance. Winning works published in college magazine.', 7, '2026-03-16', '09:00:00', 'Library Hall', 40, '₹10,000', 'upcoming'),
('Neon Nights: DJ & EDM Festival', 'The grand closing night of FestZone 2026. Campus DJ talents open the stage, followed by a headline guest DJ set. UV paint zone, glow sticks, and food trucks. Free entry for all registered students.', 1, '2026-03-16', '20:00:00', 'Main Ground', 500, 'N/A', 'upcoming'),
('Sync Step: Group Dance Battle', 'Crew-vs-crew group dance competition for teams of 6–12 members. Any dance style or fusion. Judged on synchronization, formation changes, energy, and concept. Grand prize includes trophy and studio session.', 2, '2026-03-15', '18:00:00', 'Main Auditorium', 15, '₹40,000', 'upcoming'),
('Pixel Perfect: Digital Art Contest', 'Create stunning digital artwork using tablets or laptops. Themes revealed on the spot. Tools allowed: Photoshop, Illustrator, Procreate, or any digital medium. Best pieces minted as campus NFT collection.', 4, '2026-03-14', '10:00:00', 'Digital Lab', 25, '₹18,000', 'upcoming'),
('Checkmate: Chess Championship', 'Strategic minds clash in a Swiss-system chess tournament. 7 rounds of rapid chess (15+10 time control). Open to all skill levels. FIDE-rated arbiter on-site. Prizes for top 3 plus best game award.', 5, '2026-03-14', '09:00:00', 'Seminar Hall C', 32, '₹12,000', 'upcoming');

-- Registrations (sample)
INSERT INTO Registration (student_id, event_id, status) VALUES
(1, 5, 'confirmed'), (1, 6, 'confirmed'), (2, 3, 'confirmed'), (2, 4, 'confirmed'),
(3, 10, 'confirmed'), (4, 14, 'confirmed'), (5, 5, 'confirmed'), (6, 1, 'confirmed'),
(7, 6, 'confirmed'), (8, 8, 'confirmed'), (9, 5, 'confirmed'), (10, 3, 'confirmed'),
(11, 10, 'confirmed'), (12, 14, 'confirmed'), (13, 6, 'confirmed'), (14, 4, 'confirmed'),
(15, 5, 'confirmed'), (16, 8, 'confirmed'), (17, 7, 'confirmed'), (18, 1, 'confirmed'),
(19, 14, 'confirmed'), (20, 15, 'confirmed'), (21, 5, 'confirmed'), (22, 2, 'confirmed'),
(23, 10, 'confirmed'), (24, 3, 'confirmed'), (25, 6, 'confirmed'), (26, 4, 'confirmed'),
(27, 5, 'confirmed'), (28, 8, 'confirmed'), (29, 7, 'confirmed'), (30, 15, 'confirmed');

-- Volunteers
INSERT INTO Volunteer (student_id, skills, availability, status) VALUES
(31, 'Event coordination, first aid', 'All days', 'active'),
(32, 'Photography, social media', 'Day 1, Day 2', 'active'),
(33, 'Stage management, lighting', 'All days', 'active'),
(34, 'Registration desk, hospitality', 'Day 2, Day 3', 'active'),
(35, 'Technical support, AV', 'All days', 'active'),
(36, 'Security, crowd management', 'Day 1', 'active'),
(37, 'Food stall management', 'All days', 'active'),
(38, 'Backstage support', 'Day 2, Day 3', 'active'),
(39, 'Guest reception, protocol', 'All days', 'active'),
(40, 'Social media, photography', 'Day 3', 'active'),
(41, 'Logistics, transport', 'All days', 'active'),
(42, 'IT support, networking', 'Day 1, Day 2', 'active'),
(43, 'Decoration, aesthetics', 'All days', 'active'),
(44, 'Waste management, cleanliness', 'All days', 'active'),
(45, 'Medical assistance, first aid', 'All days', 'active');

-- Assignments
INSERT INTO Assignment (volunteer_id, event_id, role, hours_worked) VALUES
(1, 5, 'Event Coordinator', 12.5),
(2, 8, 'Photography Lead', 6.0),
(3, 1, 'Stage Manager', 8.0),
(4, 14, 'Registration Desk', 5.5),
(5, 6, 'Technical Support', 10.0),
(6, 10, 'Security Lead', 7.0),
(7, 17, 'Food Management', 9.0),
(8, 3, 'Backstage Coordinator', 6.5),
(9, 1, 'Guest Reception', 5.0),
(10, 9, 'Photography', 8.0),
(11, 5, 'Logistics Support', 12.0),
(12, 6, 'IT Support', 10.5),
(13, 17, 'Decoration Lead', 4.0),
(14, 10, 'Waste Management', 7.5),
(15, 5, 'First Aid', 12.0);

-- Sponsors
INSERT INTO Sponsor (name, contact_email, contact_phone, tier, website) VALUES
('TechCorp India', 'sponsor@techcorp.in', '9800001111', 'platinum', 'https://techcorp.in'),
('InfoSys Foundation', 'foundation@infosys.com', '9800002222', 'gold', 'https://infosys.com'),
('Jio Platforms', 'events@jio.com', '9800003333', 'platinum', 'https://jio.com'),
('Red Bull India', 'sponsor@redbull.in', '9800004444', 'gold', 'https://redbull.com'),
('Boat Lifestyle', 'partner@boat.in', '9800005555', 'silver', 'https://boat-lifestyle.com'),
('Swiggy Campus', 'campus@swiggy.in', '9800006666', 'silver', 'https://swiggy.in'),
('Zomato Student', 'student@zomato.in', '9800007777', 'bronze', 'https://zomato.in'),
('PhonePe', 'events@phonepe.com', '9800008888', 'gold', 'https://phonepe.com'),
('Amazon India', 'sponsorship@amazon.in', '9800009999', 'platinum', 'https://amazon.in'),
('Nykaa Fashion', 'events@nykaa.com', '9800010101', 'silver', 'https://nykaa.com');

-- Event Sponsors
INSERT INTO Event_Sponsor (event_id, sponsor_id, sponsorship_amount) VALUES
(5, 1, 200000), (5, 3, 150000), (6, 1, 100000),
(1, 4, 80000), (17, 4, 120000), (17, 6, 50000),
(10, 3, 70000), (7, 2, 90000), (14, 8, 40000),
(3, 10, 35000), (4, 10, 35000), (8, 9, 60000);
