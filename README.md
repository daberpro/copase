# Copase

<center>
    <h1 style="font-size: xxx-large;">Copase</h1>
    <h2>"simpel but powerfull"</h2>
    <p>By Daberdev (fullstack web developer)</p>
    <img src="https://img.shields.io/npm/v/copase.svg">
    <img src="https://img.shields.io/npm/dm/copase.svg">
</center>
<br>

kapan terakhir kali anda membuat css tanpa framework? atau kapan terakhir kali anda menggunakan framework css? kapan pun itu pasti anda selalu merasakan pro dan kontra dari pengalaman dalam mengerjakan ke dua nya tapi pernah kah terpikir bagaimana jika utility class seperti tailwind di gabungkan dengan css properti?

tunggu sebentar apa???

> pasti setiap web developer pernah mengalami lupa dengan sintaks dan source code akibat dari penggunaan framework atau tools yang membantu sehingga tidak jarang terjadi ketergantunga terhadap framework atau tools

nahh jadi itulah alasan di balik bisa terciptanya copase ini (jujur sebenarnya saya males aja gitu mau belajar tools atau framework yang tujuan nya juga sama buat styling jadi saya memutuskan untuk membuat semacam tools yang terinpirasi dari tailwind css dan native css) hingga terciptalah copase
### Apa itu copase?
copase adalah suatu tools yang bertugas untuk mengenerate utility class tanpa memerlukan sintaks css sama sekali anda hanya cukup membuat class di dalam tag html dan kemudian file html yang telah anda buat akan di generate css nya
### bagaimana cara copase bekerja?
copase bekerja dengan cara melakukan scanning terhadap file html kemudian hasil scanning akan di copy dan di manipulasi kemudian di generate utility class dari setiap class yang ada di tag
### bagaimana cara menggunakan nya?

sebelum anda menggunakan copase anda terlebih dahulu harus menginstall cli atau module nya, copase berjalan di atas node js jadi yang perlu anda persiapkan antara lain `node js` 

kemudian silahkan intall copase secara global dengan cara menjalankan command berikut

```bash
npm i copase -g
```
untuk mulai mengerjakan project silahkan ikuti langkah - langkah berikut ini
1. buat folder baru
2. kemudian di dalam folder yang telah di buat, buat lagi satu folder baru dengan nama source
3. di dalam folder source silahkan isi dengan file html
4. kemudian jalankan perintah berikut 
```bash
copase
``` 
maka secara otomatis akan tergenerate suatu folder baru yaitu folder result yang merupakan hasil compile


untuk menggunakan copase ini anda juga harus terlebih dahulu harus menguasai dasar - dasar css untuk pengunaan sintaks nya sebagai berikut
```html
<h1 class="width-[100px]"></h1>
```
kok aneh banget ya?, eitsss belum juga di jelasin jadi gini nih anda hanya perlu menuliskan class aja di dalam tag html nya dan otomatis akan di generate class nya

terus itu nama kelas nya asal - asalan bisa? jawabanya adalah engga -_- jadi copase itu memiliki aturan dalam penulisan nya antara lain sebagai berikut
1. nama class merupakan properti dari css contoh `width`
2. karena merupakan properti dari css maka kita juga bisa mengisikan nilai ke dalam nya dengan cara seperti berikut `namaProperti-[value]` sebagai contoh jika kita ingin membuat width pada sebuah tag 100px maka cukup `width-[100px]` terus kalau untuk properti yang lain gimana?, caranya juga sama kok semisal pengen ubah background color maka cukup `background-color-[red]` ini sama aja seperti kita menulisakan `background-color: red;` di css 

untuk pemahaman yang lebih mendalam silahkan perhatikan ilustrasi di bawah

![image info](./a.png)

nah kelihatan jelas kan kalau sebenarnya nama class nya itu merupakan properti css

### terus buat reponsive nya gimana?
untuk membuat web yang responsive, kalian cukup menambah kan `sm,md,lg` di bagian depan nya untuk penggunaan nya ehem mirip dengan tailwind css

contoh

```html 
<h1 class="sm:color-[red] color-[black]"></h1>
```

secara otomatis ketika di ukuran layar yang telah di tentukan color pada h1 akan berubah menjadi merah untuk spesifikasi ukuran dari sm, md, dan lg sebagai berikut

| tipe | ukuran               |
|------|----------------------|
|  sm  | 0px hingga 640px     |
|  md  | 641px hingga 1007px  |
|  lg  | 1008px hingga lebih  |

## Update 1.0.1
### update perbaikan bug

## Update 1.1.0
### apa yang baru?
1. penambahan fitur psuedo class
    > penambahan fitur psuedo class mirip seperti penggunaan responsive class
    yaitu sebagai berikut

    ```html
    <h1 class="hover:color-[red] color-[blue]">Sentuh saya</h1>
    ```
2. minifier untuk css

## Update 1.1.1
### update perbaikan bug untuk nama class

## Update 1.2.0
### apa yang baru?
1. html component
    > copase mendukung adanya pembuatan component html untuk dapat menggunakan fitur ini ada terlebih dahulu harus menginstall versi 1.2.0 

    sebagai contoh penggunaan silahkan perhatikan instruksi di bawah ini
    ```txt
    |
    |-- result
    |-- source/
    |   |
    |   |---- index.html
    |
    |-- component/
    |   |
    |   |---- card.html
    |
    |-- package.json
    |-- pacage-lock.json
    |
    |
    ```
    di atas merupakan struktur yang umumnya di gunakan pada copase CLI tapi jika anda perhatikan ada perbedaan yang cukup jelas dari versi - versi sebelumnya yaitu adanya folder component

    nama untuk folder nya tidak mesti harus component apapun bisa, kemudian seperti apa component itu?

    component hanyalah suatu tag HTML biasa yang akan di gabungkan sebagai contoh component bisa hanya berupa `div`, dan component tidak boleh memiliki tag `html`,`head`,`body` atau tag yang menjadi struktur dasar lainya

    kemudian bagaimana cara untuk menggabungkan component? caranya sebagai berikut

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link rel="stylesheet" href="a.css">
    </head>
    <body>
      
      <Card as="component/card.html"></Card>

    </body>
    </html>
    ```

    seperti yang anda lihat di atas kita memasukan suatu tag yang bukan merupakan tag HTML melainkan tag custom untuk nama tag nya anda bisa memasukan nama apapun yang penting nama tag nya bukan termasuk nama tag HTML

    di dalam tag custom di atas terdapat suatu attribute `as="component/card.html"` yang merupakan attribute yang bertugas memberitahukan kepada compiler di mana lokasi file yang akan di gabungkan

    anda juga bisa melakukan penyelipan data untuk mempermudah anda dengan mengambi data dari config 

2. config
    > karena fitur html component juga memiliki penyelipan data ke dalam nya untuk mendefinisikan data tersebut anda harus membuat file `copase.config.js` yang merupakan suatu kumpulan data data yang akan di embed ke dalam html component

    untuk melihat isi configurasinya adalah sebagai berikut

    ```js
    module.exports = {
        nama: "daberdev",
        data: [
            {
                nama: "whoami",
                emote: "😴"
            },
            {
                nama: "daber",
                emote: "😑"
            }
        ]
    }
    ```

    kemudian pada component anda cukup menggunakan `${props.properti}` untuk meng-embed data ke dalam nya contoh

    ```html
    <div>
    
        <h1 class="color-[green]">${props.nama}</h1>   

    </div>

    ```

    maka hasilnya adalah
    
    ```html
    <div>
      <h1 class="color-24095081-1500 ">daberdev</h1>
    </div>
    ```

    dan anda juga di mungkinkn untuk melakukan perulangan pada component semisal jika data yang anda masukan berbentuk array untuk pengunaan nya adalah sebagai berikut

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link rel="stylesheet" href="a.css">
    </head>
    <body>
      
      <Card as="component/card.html" each="data"></card>

    </body>
    </html>
    ```

    seperti yang anda lihat di dalam custom tag nya terdapat suatu attribute yaitu each yang merupakan tempat anda memasukan data apa yang akan di looping di ambil dari `copase.config.js`

    dan di dalam component untuk mengambil data anda cukup melakukan nya sebagai berikut

    ```html
    <div>
    
        <h1 class="color-[green]">${each.nama} ${each.emote}</h1>   

    </div>

    ```

    dan hasilnya

    ```html
    <div>
      <h1 class="color-24095081-1500 ">whoami 😴</h1>
    </div>
    <div>
      <h1 class="color-24095081-1500 ">daber 😑</h1>
    </div>
    ```
