# FullStack-Task
Product API (NestJS + Prisma + SQLite)

Stage-1 gereksinimlerine uygun katmanlı mimaride basit bir ürün yönetimi API’si.

Framework: NestJS (Controller → Service → Repository)

ORM: Prisma

DB: SQLite (Docker gerektirmez)

Validasyon: class-validator

Dokümantasyon: Swagger (/docs)

Konfig: .env (12-Factor)

Not: Bu backend, Stage-2/3’e zemin olacak şekilde tasarlandı (JWT, CQRS, Redis, vs. sonradan eklenebilir).


İçindekiler

Önkoşullar

Hızlı Başlangıç

Proje Yapısı

Çevresel Değişkenler (.env)

Komutlar (npm scripts)

Veritabanı ve Migration

API Kullanımı

Swagger UI

cURL ile test

İstek/Gövde Şemaları (DTO)

Hata Modeli

CORS ve Güvenlik Notları

Geliştirme Rehberi

Sık Karşılaşılan Hatalar & Çözümler

Yol Haritası (Sonraki Adımlar)

Lisans

Önkoşullar

Node.js 18+

npm (ya da tercih ettiğin paket yöneticisi)

Git (önerilir)

Hızlı Başlangıç
# repo kökünde backend klasörüne gel
cd backend

# bağımlılıkları kur
npm install

# .env oluştur
cp .env.example .env
# (ya da içerikleri aşağıdaki .env bölümünden kopyala)

# Prisma migration
npx prisma migrate dev --name init

# Geliştirme sunucusu
npm run start:dev


API: http://localhost:4000

Swagger: http://localhost:4000/docs

/ (kök) için endpoint tanımlı değildir, 404 dönmesi normaldir. Test için /docs veya /products kullanın.

Proje Yapısı
backend/
├─ prisma/
│  ├─ schema.prisma         # Veritabanı şeması
│  └─ migrations/           # Otomatik oluşturulan migrationlar
├─ src/
│  ├─ prisma/
│  │  ├─ prisma.module.ts   # Global Prisma modülü
│  │  └─ prisma.service.ts  # PrismaClient yaşam döngüsü
│  ├─ products/
│  │  ├─ dto/
│  │  │  ├─ create-product.dto.ts
│  │  │  └─ update-product.dto.ts
│  │  ├─ product.repository.ts
│  │  ├─ products.controller.ts
│  │  ├─ products.module.ts
│  │  └─ products.service.ts
│  ├─ app.module.ts
│  └─ main.ts               # CORS, ValidationPipe, Swagger
├─ .env
├─ package.json
└─ README.md


Katmanlar

Controller: HTTP isteklerini alır, request/response işini yürütür

Service: İş kuralları (business logic)

Repository: Veritabanı erişimi (Prisma)

Çevresel Değişkenler (.env)

backend/.env:

# Sunucu portu
PORT=4000

# SQLite veritabanı
DATABASE_URL="file:./dev.db"


Farklı bir port istiyorsanız PORT değerini değiştirin. Prisma için SQLite yolunu (dosya ismi/konumu) da değiştirebilirsiniz.

Örnek dosya: backend/.env.example

PORT=4000
DATABASE_URL="file:./dev.db"

Komutlar (npm scripts)

package.json içinden:

Komut	Açıklama
npm run start	Prod modda başlatır
npm run start:dev	Hot-reload ile geliştirme modunda başlatır
npm run prisma:migrate	prisma migrate dev kısayolu
npx prisma migrate dev --name <ad>	Yeni migration oluşturup uygular
npx prisma studio	Web arayüzü ile DB’yi görüntüle/düzenle
Veritabanı ve Migration

Şema: prisma/schema.prisma

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  price       Float
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}


İlk migration & DB oluşturma

npx prisma migrate dev --name init


Prisma Studio (opsiyonel)

npx prisma studio
# Tarayıcıda Product tablosunu görebilirsiniz.

API Kullanımı
Swagger UI

Adres: http://localhost:4000/docs

Try it out butonu ile tarayıcıdan doğrudan deneyebilirsiniz.

cURL ile test

1) Ürün listeleme

curl http://localhost:4000/products
# []


2) Ürün ekleme (POST)

curl -X POST http://localhost:4000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Coffee Mug","price":129.9,"description":"Ceramic"}'


3) Tekrar listele

curl http://localhost:4000/products


4) Tek ürün (id değişken olabilir)

curl http://localhost:4000/products/1


5) Güncelleme (PUT)

curl -X PUT http://localhost:4000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":149.9}'


6) Silme (DELETE)

curl -X DELETE http://localhost:4000/products/1

İstek/Gövde Şemaları (DTO)

CreateProductDto

{
  name: string;      // zorunlu, boş olamaz
  price: number;     // zorunlu, >= 0
  description?: string;
}


UpdateProductDto

CreateProductDto’nun tüm alanlarını opsiyonel kabul eder (partial).

Örnek:

{
  name?: string;
  price?: number;
  description?: string;
}


Validasyon

class-validator ile global ValidationPipe aktiftir.

Yanlış tip/eksik alanlar 400 (Bad Request) döner.

Hata Modeli

NestJS standart hata gövdesi (örnek):

{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "name must be a string",
    "price must not be less than 0"
  ],
  "error": "Bad Request"
}


Kaynak bulunamadı (örnek):

{
  "statusCode": 404,
  "message": "Product not found",
  "error": "Not Found"
}

CORS ve Güvenlik Notları

CORS açık: app.enableCors({ origin: true }).

Prod’da origin listesini kısıtlayın (örn. origin: ['https://your-frontend.com']).

Swagger prod ortamda yalnızca iç ağa/korumalı ortama açılmalıdır.

Logger/Exception yönetimi şu an basit tutuldu. Prod’da gelişmiş loglama (örn. Pino/Serilog/ELK) önerilir.

Geliştirme Rehberi
Yeni Endpoint Nasıl Eklenir?

DTO: src/<feature>/dto/ içine istek gövdesi tiplerini yaz.

Repository: Veritabanı işlemlerini soyutla (PrismaService kullan).

Service: İş kuralları (validation, koşullar, hata fırlatma).

Controller: Route, parametreler, @Body(), @Param() vb.

Modül: Provider/controller kayıtları.

Örnek Kod Kalıpları

Parametre doğrulama:

@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) { ... }


Global Pipe (main.ts):

app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

Kod Kalitesi

SRP (Single Responsibility): Controller/Service/Repository sorumluluklarını ayırın.

DI (Dependency Injection): Servis ve repo bağımlılıklarını constructor ile alın.

DTO’larda tip güvenliği ve validasyon kuralları net olsun.

Sık Karşılaşılan Hatalar & Çözümler
1) {"message":"Cannot GET /","statusCode":404}

Kök URL (/) için endpoint yok. Bu normal. Test için:

http://localhost:4000/docs

http://localhost:4000/products

2) Cannot find module 'class-validator' veya '@nestjs/swagger'
npm i class-validator class-transformer
npm i @nestjs/swagger swagger-ui-express

3) Prisma şema hatası: Native type Text is not supported for sqlite connector

SQLite için @db.Text kullanmayın. description String? yeterlidir.

4) ECONNREFUSED veya sunucuya bağlanamama

npm run start:dev çalışıyor mu?

Port .env ile 4000 mi? Başka servis portu kullanıyor olabilir.

5) Bad Request (400) validasyon hataları

Gövde şemasını DTO’ya göre gönderin. name: string, price: number (>=0).

Yol Haritası (Sonraki Adımlar)

(Stage-2) Auth servisi (JWT), Product için CQRS + Redis Cache

Global exception filter + yapılandırılabilir logger (Serilog/Pino)

OpenAPI şemasından client SDK üretimi

(Stage-3) Mikroservis ve API Gateway, event-driven mimari


# 🛍️ Products Frontend (Next.js 15)

Bu proje, ürün listeleme ve yönetim arayüzü için geliştirilmiş **Next.js 15 (App Router)** tabanlı bir frontend uygulamasıdır.  
Modern UI, TailwindCSS, animasyonlu skeleton yükleme ekranı ve API entegrasyonu içerir.

---

## 🚀 Özellikler
- **Next.js 15** (App Router + Server Components uyumlu)
- **TypeScript** desteği
- **TailwindCSS** ile modern responsive tasarım
- **Skeleton Loading UI** (animasyonlu shimmer efektli)
- **API entegrasyonu** (`/lib/api.ts`)
- **Clean UI/UX** (blur, gradient, glass effect tasarımları)

---

## 📦 Kurulum

Projeyi klonladıktan sonra bağımlılıkları yükle:

```bash
git clone <repo-url>
cd frontend
npm install

