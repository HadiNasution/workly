# List Fitur Workly

Login :

- login with Google (?)
- login with email and password (gifted by admin)

User (employee) :

- absen
- rekap kehadiran (1 minggu terakhir)
- rekap kehadiran (perbulan)
- profile details
- update foto profile
- pengajuan cuti, izin, sakit
- filter rekap kehadiran (opt)

Admin :

- create user
- update user
- delete user
- get user (daftar karyawan)
- rekap karyawan sakit/izin per hari
- diagram/presentase kehadiran seluruh karyawan perbulan
- search user
- permission sakit, izin, cuti
- rekap kehadiran karyawan perbulan (opt)
- download report (perbulan) as excel (opt)

Superadmin :

- add admin
- update admin
- delete admin
- get admin (daftar admin aktif)

## rules

- absen menggunakan lokasi user
- jika user diluar zona absensi, maka tidak bisa melakukan absen (tidak berlaku untuk wfh)
- jika status wfh aktif, maka bisa melakukan absen dibebas lokasi
- fitur lokasi di perangkat user harus aktif
- jika sudah ganti hari, maka insert data baru di tabel attendance per karyawan (misal hari senin, 5 karyawan hadir maka insert 5 data baru)
- validasi saat absen out
- jika tidak sengaja absen out, harus minta admin untuk mereset absen out
- jika tidak absen out, maka status dihari itu tetap work
- waktu kerja dihitung 9 jam (termasuk istirahat) dari waktu absen in
- jika absen in jam 8 maka boleh absen out mulai dari jam 5
- jika tidak bekerja dibulan sebelumnya, maka di rekap kehadiran (kalender) di disable (opt)
