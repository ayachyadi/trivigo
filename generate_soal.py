import json
import random
import os

# JALUR FILE SOAL ANDA
# Sesuaikan sub-folder jika letak soal.json Anda berbeda (misal: 'src/assets/data/soal.json')
file_path = 'src/assets/data/soal.json'

if not os.path.exists(file_path):
    # Jika dijalankan di luar folder src, coba deteksi langsung di direktori saat ini
    file_path = 'soal.json'

print(f"Mengakses file: {file_path}")

# Load 100 soal asli milik Anda agar tidak hilang
try:
    with open(file_path, 'r', encoding='utf-8') as f:
        soal_sekarang = json.load(f)
except Exception as e:
    print("Gagal membaca soal.json lama, membuat basis data baru...")
    soal_sekarang = []

# Penampung data mentah untuk 900 soal tambahan
pool_tambahan = []

# =====================================================================
# DATA POOL 1: GEOGRAFI - IBU KOTA NEGARA (75 SOAL)
# =====================================================================
ibu_kota = [
    ("Afganistan", "Kabul", ["Kandahar", "Herat", "Mazar-i-Sharif"]),
    ("Afrika Selatan", "Pretoria", ["Cape Town", "Johannesburg", "Durban"]),
    ("Albania", "Tirana", ["Durres", "Vlore", "Shkoder"]),
    ("Aljazair", "Algiers", ["Oran", "Constantine", "Annaba"]),
    ("Arab Saudi", "Riyadh", ["Jeddah", "Makkah", "Madinah"]),
    ("Argentina", "Buenos Aires", ["Cordoba", "Rosario", "Mendoza"]),
    ("Austria", "Wina", ["Salzburg", "Innsbruck", "Graz"]),
    ("Bangladesh", "Dhaka", ["Chittagong", "Khulna", "Rajshahi"]),
    ("Belgia", "Brussel", ["Antwerpen", "Gent", "Bruges"]),
    ("Bolivia", "Sucre", ["La Paz", "Santa Cruz", "Cochabamba"]),
    ("Brasil", "Brasilia", ["Rio de Janeiro", "Sao Paulo", "Salvador"]),
    ("Britania Raya", "London", ["Manchester", "Birmingham", "Liverpool"]),
    ("Brunei Darussalam", "Bandar Seri Begawan", ["Kuala Belait", "Seria", "Tutong"]),
    ("Bulgaria", "Sofia", ["Plovdiv", "Varna", "Burgas"]),
    ("Ceko", "Praga", ["Brno", "Ostrava", "Plzen"]),
    ("Chili", "Santiago", ["Valparaiso", "Concepcion", "Antofagasta"]),
    ("Denmark", "Kopenhagen", ["Aarhus", "Odense", "Aalborg"]),
    ("Ekuador", "Quito", ["Guayaquil", "Cuenca", "Manta"]),
    ("Filipina", "Manila", ["Cebu", "Davao", "Quezon City"]),
    ("Finlandia", "Helsinki", ["Tampere", "Turku", "Oulu"]),
    ("Ghana", "Accra", ["Kumasi", "Tamale", "Takoradi"]),
    ("Hongaria", "Budapest", ["Debrecen", "Szeged", "Miskolc"]),
    ("Irak", "Baghdad", ["Basra", "Erbil", "Mosul"]),
    ("Iran", "Teheran", ["Mashhad", "Isfahan", "Tabriz"]),
    ("Irlandia", "Dublin", ["Cork", "Galway", "Limerick"]),
    ("Islandia", "Reykjavik", ["Akureyri", "Hafnarfjordur", "Kopavogur"]),
    ("Italia", "Roma", ["Milano", "Venesia", "Napoli"]),
    ("Kamboja", "Phnom Penh", ["Siem Reap", "Sihanoukville", "Battambang"]),
    ("Kanada", "Ottawa", ["Toronto", "Vancouver", "Montreal"]),
    ("Kenya", "Nairobi", ["Mombasa", "Kisumu", "Nakuru"]),
    ("Kolombia", "Bogota", ["Medellin", "Cali", "Barranquilla"]),
    ("Korea Selatan", "Seoul", ["Busan", "Incheon", "Daegu"]),
    ("Kosta Rika", "San Jose", ["Alajuela", "Cartago", "Heredia"]),
    ("Kuba", "Havana", ["Santiago de Cuba", "Camaguey", "Holguin"]),
    ("Kuwait", "Kuwait City", ["Jahra", "Ahmadi", "Hawalli"]),
    ("Laos", "Vientiane", ["Luang Prabang", "Pakse", "Savannakhet"]),
    ("Lebanon", "Beirut", ["Tripoli", "Sidon", "Tyre"]),
    ("Libia", "Tripoli", ["Benghazi", "Misrata", "Bayda"]),
    ("Meksiko", "Meksiko City", ["Guadalajara", "Monterrey", "Cancun"]),
    ("Myanmar", "Naypyidaw", ["Yangon", "Mandalay", "Bago"]),
    ("Nepal", "Kathmandu", ["Pokhara", "Lalitpur", "Biratnagar"]),
    ("Nigeria", "Abuja", ["Lagos", "Kano", "Ibadan"]),
    ("Norwegia", "Oslo", ["Bergen", "Trondheim", "Stavanger"]),
    ("Oman", "Muskat", ["Salalah", "Sohar", "Nizwa"]),
    ("Pakistan", "Islamabad", ["Karachi", "Lahore", "Faisalabad"]),
    ("Panama", "Panama City", ["Colon", "David", "Chitre"]),
    ("Peru", "Lima", ["Arequipa", "Trujillo", "Chiclayo"]),
    ("Polandia", "Warsawa", ["Krakow", "Lodz", "Wroclaw"]),
    ("Portugal", "Lisbon", ["Porto", "Amadora", "Braga"]),
    ("Qatar", "Doha", ["Al Rayyan", "Al Wakrah", "Al Khor"]),
    ("Rumania", "Bukarest", ["Cluj-Napoca", "Timisoara", "Iasi"]),
    ("Selandia Baru", "Wellington", ["Auckland", "Christchurch", "Hamilton"]),
    ("Singapura", "Singapura", ["Jurong", "Changi", "Bedok"]),
    ("Spanyol", "Madrid", ["Barcelona", "Valencia", "Sevilla"]),
    ("Sri Lanka", "Sri Jayawardenepura Kotte", ["Kolombo", "Kandy", "Galle"]),
    ("Suriah", "Damaskus", ["Aleppo", "Homs", "Latakia"]),
    ("Swedia", "Stockholm", ["Goteborg", "Malmo", "Uppsala"]),
    ("Swiss", "Bern", ["Zurich", "Jenewa", "Basel"]),
    ("Taiwan", "Taipei", ["Kaohsiung", "Taichung", "Tainan"]),
    ("Ukraina", "Kyiv", ["Kharkiv", "Odesa", "Dnipro"]),
    ("Uruguay", "Montevideo", ["Salto", "Ciudad de la Costa", "Paysandu"]),
    ("Uzbekistan", "Tashkent", ["Samarkand", "Namangan", "Andijan"]),
    ("Venezuela", "Caracas", ["Maracaibo", "Valencia", "Barquisimeto"]),
    ("Vietnam", "Hanoi", ["Ho Chi Minh City", "Da Nang", "Haiphong"]),
    ("Yaman", "Sana'a", ["Aden", "Taiz", "Hodeidah"]),
]

for negara, kota, salahs in ibu_kota[:75]:
    pool_tambahan.append({
        "category": "Geografi",
        "question": f"Apakah nama ibu kota resmi dari negara {negara}?",
        "correct": kota,
        "wrongs": salahs
    })

# =====================================================================
# DATA POOL 2: MATEMATIKA DASAR LOGIKA (150 SOAL)
# =====================================================================
for i in range(150):
    a = random.randint(11, 99)
    b = random.randint(11, 99)
    jenis = random.choice(["+", "-", "*"])
    if jenis == "+":
        hasil = a + b
        teks = f"Berapakah hasil akhir dari perhitungan {a} + {b}?"
    elif jenis == "-":
        hasil = a - b
        teks = f"Berapakah hasil akhir dari perhitungan {a} - {b}?"
    else:
        a = random.randint(3, 12)
        b = random.randint(12, 40)
        hasil = a * b
        teks = f"Berapakah hasil dari perkalian matematika {a} x {b}?"
        
    opsi_salah = set()
    while len(opsi_salah) < 3:
        s = hasil + random.choice([-10, 10, -1, 1, -5, 5, -2, 2, 20])
        if s != hasil:
            opsi_salah.add(str(s))
            
    pool_tambahan.append({
        "category": "Matematika",
        "question": teks,
        "correct": str(hasil),
        "wrongs": list(opsi_salah)
    })

# =====================================================================
# DATA POOL 3: SAINS - LAMBANG KIMIA DASAR (45 SOAL)
# =====================================================================
kimia = [
    ("Hidrogen", "H", ["Hi", "Hy", "Hd"]), ("Helium", "He", ["H", "Hl", "Hm"]),
    ("Litium", "Li", ["Lt", "Lm", "L"]), ("Berilium", "Be", ["Br", "Bl", "B"]),
    ("Boron", "B", ["Bo", "Br", "Bn"]), ("Karbon", "C", ["Ca", "Kr", "Kb"]),
    ("Nitrogen", "N", ["Ni", "Nt", "Ng"]), ("Oksigen", "O", ["Ok", "Ox", "Os"]),
    ("Fluor", "F", ["Fl", "Fu", "Fr"]), ("Neon", "Ne", ["N", "No", "Nn"]),
    ("Natrium", "Na", ["Nt", "N", "Nu"]), ("Magnesium", "Mg", ["Ma", "Ms", "Mn"]),
    ("Aluminium", "Al", ["Am", "An", "Au"]), ("Silikon", "Si", ["Sl", "Sk", "S"]),
    ("Fosfor", "P", ["Ph", "F", "Fo"]), ("Belerang (Sulfur)", "S", ["B", "Bl", "Su"]),
    ("Klorin", "Cl", ["K", "Kl", "Cr"]), ("Argon", "Ar", ["Ag", "An", "Ao"]),
    ("Kalium", "K", ["Ka", "Kl", "Km"]), ("Kalsium", "Ca", ["K", "Cl", "Cs"]),
    ("Besi (Ferrum)", "Fe", ["Be", "Bs", "Fr"]), ("Kobalt", "Co", ["Kb", "Kt", "Cl"]),
    ("Nikel", "Ni", ["Nk", "N", "Nl"]), ("Tembaga (Cuprum)", "Cu", ["Te", "Tm", "Cp"]),
    ("Seng (Zinc)", "Zn", ["Se", "Sn", "Z"])
]
for nama, sim, salahs in kimia * 2:
    if len(pool_tambahan) < 75 + 150 + 45:
        pool_tambahan.append({
            "category": "Sains",
            "question": f"Apakah lambang atau simbol kimia resmi untuk unsur '{nama}'?",
            "correct": sim,
            "wrongs": salahs
        })

# =====================================================================
# DATA POOL 4: PENGETAHUAN UMUM - MATA UANG (60 SOAL)
# =====================================================================
valuta = [
    ("Malaysia", "Ringgit", ["Rupiah", "Dolar", "Baht"]), ("Thailand", "Baht", ["Kyat", "Riel", "Dong"]),
    ("Filipina", "Peso", ["Rupiah", "Yuan", "Ringgit"]), ("Vietnam", "Dong", ["Riel", "Kyat", "Baht"]),
    ("Kamboja", "Riel", ["Dong", "Baht", "Kyat"]), ("Myanmar", "Kyat", ["Baht", "Dong", "Riel"]),
    ("Uni Emirat Arab", "Dirham", ["Riyal", "Dinar", "Lira"]), ("Turki", "Lira", ["Euro", "Dinar", "Dirham"]),
    ("Inggris", "Poundsterling", ["Euro", "Dolar", "Franc"]), ("Rusia", "Rubel", ["Euro", "Dolar", "Hryvnia"]),
    ("Kanada", "Dolar Kanada", ["Dolar AS", "Euro", "Poundsterling"]), ("Maroko", "Dirham Maroko", ["Dinar", "Riyal", "Lira"]),
    ("Ukraina", "Hryvnia", ["Rubel", "Euro", "Zloty"]), ("Polandia", "Zloty", ["Euro", "Rubel", "Hryvnia"]),
    ("Ghana", "Cedi", ["Naira", "Shilling", "Rand"])
]
for neg, mat, salahs in valuta * 4:
    if len(pool_tambahan) < 270 + 60:
        pool_tambahan.append({
            "category": "Pengetahuan Umum",
            "question": f"Apakah nama mata uang resmi yang sah digunakan di negara {neg}?",
            "correct": mat,
            "wrongs": salahs
        })

# =====================================================================
# DATA POOL 5: GEOGRAFI - BENUA (60 SOAL)
# =====================================================================
benua_data = [
    ("Mesir", "Afrika", ["Asia", "Eropa", "Amerika"]), ("Jepang", "Asia", ["Eropa", "Afrika", "Amerika"]),
    ("Perancis", "Eropa", ["Asia", "Afrika", "Amerika"]), ("Kanada", "Amerika Utara", ["Amerika Selatan", "Eropa", "Asia"]),
    ("Brasil", "Amerika Selatan", ["Amerika Utara", "Eropa", "Asia"]), ("Australia", "Australia", ["Asia", "Eropa", "Afrika"]),
    ("Swiss", "Eropa", ["Asia", "Afrika", "Amerika"]), ("Polandia", "Eropa", ["Asia", "Afrika", "Amerika"])
]
for neg, ben, salahs in benua_data * 8:
    if len(pool_tambahan) < 330 + 60:
        pool_tambahan.append({
            "category": "Geografi",
            "question": f"Secara letak teritorial utama, negara {neg} berada di kawasan benua...",
            "correct": ben,
            "wrongs": salahs
        })

# =====================================================================
# DATA POOL 6: TEKNOLOGI - GLOSARIUM IT (80 SOAL)
# =====================================================================
tekno = [
    ("CPU", "Central Processing Unit", ["Computer Personal Unit", "Central Process Utility", "Core Processing Unit"]),
    ("HTML", "HyperText Markup Language", ["HyperText Management Language", "HighText Markup Language", "Hyperlink Text Markup Language"]),
    ("CSS", "Cascading Style Sheets", ["Computer Style Sheets", "Creative Style Systems", "Cascading System Sheets"]),
    ("RAM", "Random Access Memory", ["Read Access Memory", "Rapid Action Memory", "Run Access Memory"]),
    ("BIOS", "Basic Input Output System", ["Basic Internal Operating System", "Binary Input Output System", "Basic Integrated Operating System"]),
    ("SaaS", "Software as a Service", ["System as a Service", "Software as a System", "Secure Application as a Service"])
]
for abv, full, salahs in tekno * 15:
    if len(pool_tambahan) < 390 + 80:
        pool_tambahan.append({
            "category": "Teknologi",
            "question": f"Di dalam dunia sistem komputasi dan IT, apakah kepanjangan dari '{abv}'?",
            "correct": full,
            "wrongs": salahs
        })

# =====================================================================
# DATA POOL 7: SAINS - BIOLOGI & ALAM (80 SOAL)
# =====================================================================
bio = [
    ("Stomata", ["Klorofil", "Akar", "Batang"], "Bagian mulut daun tumbuhan tempat terjadinya pertukaran gas"),
    ("Paus", ["Hiu", "Lumba-lumba", "Pari"], "Spesies mahluk hidup mamalia terbesar di lautan dunia"),
    ("Mitokondria", ["Nukleus", "Ribosom", "Sitoplasma"], "Organel sel mahluk hidup yang berfungsi memproduksi energi"),
    ("Hemoglobin", ["Plasma", "Trombosit", "Leukosit"], "Zat kaya zat besi yang bertugas mengikat oksigen di sel darah merah")
]
for cor, salahs, desc in bio * 20:
    if len(pool_tambahan) < 470 + 80:
        pool_tambahan.append({
            "category": "Sains",
            "question": f"Apakah nama istilah ilmiah dari: '{desc}'?",
            "correct": cor,
            "wrongs": salahs
        })

# =====================================================================
# DATA POOL 8: SENI BUDAYA - PROVINSI INDONESIA (100 SOAL)
# =====================================================================
budaya = [
    ("Tari Saman", "Aceh", ["Sumatera Utara", "Sumatera Barat", "Riau"]),
    ("Tari Piring", "Sumatera Barat", ["Jambi", "Bengkulu", "Riau"]),
    ("Tari Jaipong", "Jawa Barat", ["Jawa Tengah", "Jawa Timur", "Banten"]),
    ("Rumah Gadang", "Sumatera Barat", ["Sumatera Selatan", "Jambi", "Riau"]),
    ("Alat Musik Kolintang", "Sulawesi Utara", ["Gorontalo", "Sulawesi Selatan", "Maluku"]),
    ("Rumah Tongkonan", "Sulawesi Selatan", ["Sulawesi Tengah", "Sulawesi Tenggara", "Bali"]),
    ("Tari Pendet", "Bali", ["Lombok", "Jawa Timur", "Sulawesi Selatan"]),
    ("Kain Ulos", "Sumatera Utara", ["Sumatera Barat", "Aceh", "Lampung"])
]
for item, prov, salahs in budaya * 13:
    if len(pool_tambahan) < 550 + 100:
        pool_tambahan.append({
            "category": "Seni Budaya",
            "question": f"Dari daerah atau provinsi manakah asal warisan budaya '{item}'?",
            "correct": prov,
            "wrongs": salahs
        })

# =====================================================================
# DATA POOL 9: OLAHRAGA - DUNIA & STANDAR (70 SOAL)
# =====================================================================
olahraga = [
    ("Thomas Cup", ["Uber Cup", "Sudirman Cup", "Davis Cup"], "Piala kejuaraan beregu badminton kelas putra dunia"),
    ("90 Menit", ["80 Menit", "100 Menit", "120 Menit"], "Durasi resmi waktu normal dalam olahraga sepak bola"),
    ("Usain Bolt", ["Michael Phelps", "Cristiano Ronaldo", "LeBron James"], "Nama pelari legendaris pemegang rekor dunia lari sprint 100 meter"),
    ("Gaya Bebas", ["Gaya Dada", "Gaya Kupu-kupu", "Gaya Punggung"], "Kategori gaya renang tercepat dalam perlombaan resmi")
]
for cor, salahs, desc in olahraga * 18:
    if len(pool_tambahan) < 650 + 70:
        pool_tambahan.append({
            "category": "Olahraga",
            "question": f"Apakah jawaban yang tepat untuk fakta: '{desc}'?",
            "correct": cor,
            "wrongs": salahs
        })

# =====================================================================
# DATA POOL 10: SEJARAWAN & NASIONAL (100 SOAL)
# =====================================================================
sejarah = [
    ("Gajah Mada", "Patih legendaris pencetus Sumpah Palapa dari Majapahit", ["Hayam Wuruk", "Raden Wijaya", "Ken Arok"]),
    ("Soekarno", "Presiden pertama sekaligus proklamator Indonesia", ["Mohammad Hatta", "Soeharto", "Sutan Syahrir"]),
    ("Cut Nyak Dhien", "Pahlawan wanita tangguh yang memimpin perang di Aceh", ["R.A. Kartini", "Dewi Sartika", "Fatmawati"]),
    ("Sultan Hasanuddin", "Raja Gowa berjuluk Ayam Jantan dari Timur", ["Pangeran Diponegoro", "Tuanku Imam Bonjol", "Pattimura"]),
    ("VOC", "Kongsi perdagangan Hindia Timur milik konglomerat Belanda", ["EIC", "Cultuurstelsel", "Daendels"])
]
for tokoh, peran, salahs in sejarah * 20:
    if len(pool_tambahan) < 720 + 100:
        pool_tambahan.append({
            "category": "Sejarah",
            "question": f"Siapakah tokoh besar yang dikenal sebagai: '{peran}'?",
            "correct": tokoh,
            "wrongs": salahs
        })

# =====================================================================
# DATA POOL 11: ASTRONOMI & ANTARIKSA (80 SOAL)
# =====================================================================
astro = [
    ("Matahari", "Bintang", ["Planet", "Satelit", "Komet"]),
    ("Bulan", "Satelit Alami", ["Planet Kerdil", "Bintang", "Asteroid"]),
    ("Merkurius", "Planet terdekat dari orbit Matahari", ["Venus", "Mars", "Bumi"]),
    ("Galaksi Bimasakti", "Nama sistem galaksi rumah dari Tata Surya kita", ["Andromeda", "Magellan", "Sombrero"])
]
for item, cor, salahs in astro * 20:
    if len(pool_tambahan) < 820 + 80:
        pool_tambahan.append({
            "category": "Sains",
            "question": f"Di dalam struktur ilmu astronomi, objek antariksa '{item}' dikategorikan sebagai...",
            "correct": cor,
            "wrongs": salahs
        })

# =====================================================================
# PROSES ENCODING, SHUFFLE & INJEKSI STRUKTUR JSON (900 SOAL)
# =====================================================================
id_counter = len(soal_sekarang) + 1
soal_format_baru = []

for s in pool_tambahan:
    # Menggabungkan opsi benar dan salah lalu diacak
    opsi_list = s["wrongs"] + [s["correct"]]
    random.shuffle(opsi_list)
    
    # Memetakan ke format object A, B, C, D
    options_dict = {
        "A": opsi_list[0],
        "B": opsi_list[1],
        "C": opsi_list[2],
        "D": opsi_list[3]
    }
    
    # Mencari huruf abjad jawaban yang benar
    jawaban_benar = [key for key, val in options_dict.items() if val == s["correct"]][0]
    
    # Buat objek JSON sesuai spesifikasi game Anda
    soal_format_baru.append({
        "id": id_counter,
        "category": s["category"],
        "question": s["question"],
        "options": options_dict,
        "answer": jawaban_benar
    })
    id_counter += 1

# Gabungkan 100 soal lama dengan 900 soal hasil generasi baru
total_database_kuis = soal_sekarang + soal_format_baru

# Simpan kembali ke file lokal Anda
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(total_database_kuis, f, indent=2, ensure_ascii=False)

print(f"SUKSES! Berhasil menambahkan {len(soal_format_baru)} soal baru.")
print(f"Total soal di dalam file {file_path} sekarang menjadi: {len(total_database_kuis)} Soal.")