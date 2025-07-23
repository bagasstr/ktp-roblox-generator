'use client'

import { cn } from '@/lib/utils'
import { useState, useEffect, ChangeEvent, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import SignaturePad from 'react-signature-canvas'

function formatTanggal(isoDate: string) {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return isoDate
  const bulan = [
    '',
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]
  return `${day} ${bulan[parseInt(month, 10)]} ${year}`
}

const generateRandomNik = () => {
  let nik = ''
  for (let i = 0; i < 16; i++) {
    nik += Math.floor(Math.random() * 10)
  }
  return nik
}

const KTP_WIDTH = 950 // px (preview besar di layar)
const KTP_HEIGHT = 480 // px (preview besar di layar)
const KTP_DOWNLOAD_WIDTH = 350 // px (ukuran download)
const KTP_DOWNLOAD_HEIGHT = 230 // px (ukuran download)

const Home = () => {
  const [formData, setFormData] = useState({
    provinsi: '',
    kabOrKota: 'Kabupaten',
    kabKota: '',
    nama: '',
    nik: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki',
    alamat: '',
    rtRw: '',
    kelDesa: '',
    kecamatan: '',
    agama: '',
    statusPerkawinan: '',
    pekerjaan: '',
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [ttdUrl, setTtdUrl] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const sigPadRef = useRef<any>(null)

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Handle avatar upload
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setAvatarUrl(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle random NIK
  const handleRandomNik = () => {
    setFormData((prev) => ({ ...prev, nik: generateRandomNik() }))
  }

  // Download KTP as image
  const handleDownloadSVG = () => {
    if (svgRef.current) {
      const svg = svgRef.current
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      canvas.width = KTP_DOWNLOAD_WIDTH
      canvas.height = KTP_DOWNLOAD_HEIGHT
      const ctx = canvas.getContext('2d')
      const img = new window.Image()
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
        const link = document.createElement('a')
        link.download = `ktp-roblox-${formData.nama || 'avatar'}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
      img.src =
        'data:image/svg+xml;base64,' +
        window.btoa(unescape(encodeURIComponent(svgData)))
    }
  }

  // Scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate')
        }
      })
    }, observerOptions)

    const animateElements = document.querySelectorAll(
      '.scroll-animate, .scroll-animate-left, .scroll-animate-right'
    )
    animateElements.forEach((el) => observer.observe(el))

    return () => {
      animateElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Offset untuk navbar
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  // Tambahkan fungsi untuk tanggal hari ini
  const getToday = () => {
    const d = new Date()
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-teal-900'
      )}>
      {/* Navigation */}
      <nav className='fixed w-full top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20'>
        <div className='max-w-7xl mx-auto flex items-center justify-between p-6 lg:px-8'>
          <div className='flex items-center space-x-2'>
            <div className='w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-xl'>📋</span>
            </div>
            <span className='text-white font-bold text-xl'>
              KTP Roblox Generator
            </span>
          </div>
          <div className='hidden md:flex items-center space-x-8'>
            <button
              onClick={() => scrollToSection('generator')}
              className='text-white hover:text-green-400 transition-all duration-300 hover:scale-105'>
              Generator
            </button>
            <button
              onClick={() => scrollToSection('fitur')}
              className='text-white hover:text-green-400 transition-all duration-300 hover:scale-105'>
              Fitur
            </button>
            <button
              onClick={() => scrollToSection('tutorial')}
              className='text-white hover:text-green-400 transition-all duration-300 hover:scale-105'>
              Tutorial
            </button>
            <button
              onClick={() => scrollToSection('generator')}
              className='bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg'>
              Mulai Buat KTP
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='relative px-6 lg:px-8 pt-32 pb-16'>
        <div className='max-w-7xl mx-auto text-center'>
          <h1 className='scroll-animate text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight'>
            Generator
            <span className='block text-gradient bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'>
              KTP Roblox
            </span>
          </h1>
          <p className='scroll-animate text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto'>
            Buat KTP (Kartu Tanda Penduduk) profesional untuk avatar Roblox
            Anda! Desain otentik, mudah digunakan, dan 100% gratis.
          </p>
          <div className='scroll-animate flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <button
              onClick={() => scrollToSection('generator')}
              className='bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg'>
              🚀 Buat KTP Sekarang
            </button>
            <button
              onClick={() => scrollToSection('tutorial')}
              className='border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-all'>
              📖 Lihat Tutorial
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className='absolute top-32 left-10 w-20 h-20 bg-green-400 rounded-full opacity-20 animate-bounce'></div>
        <div className='absolute top-52 right-10 w-16 h-16 bg-blue-500 rounded-full opacity-20 animate-bounce delay-100'></div>
        <div className='absolute bottom-20 left-1/4 w-12 h-12 bg-teal-400 rounded-full opacity-20 animate-bounce delay-200'></div>
      </section>

      {/* KTP Generator Section */}
      <section id='generator' className='py-24 bg-white'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='scroll-animate text-4xl lg:text-5xl font-bold text-gray-900 mb-6'>
              Generator KTP Roblox
            </h2>
            <p className='scroll-animate text-xl text-gray-600 max-w-3xl mx-auto'>
              Isi data di bawah ini untuk membuat KTP Roblox yang unik dan
              profesional untuk avatar Anda
            </p>
          </div>

          <div className='flex items-start flex-col md:flex-row justify-center gap-12'>
            {/* Form Section */}
            <div className='scroll-animate-left bg-gray-50 rounded-2xl p-8'>
              <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                📝 Data Pribadi
              </h3>
              <div className='space-y-6'>
                <div>
                  <Label
                    htmlFor='provinsi'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Provinsi
                  </Label>
                  <Input
                    id='provinsi'
                    name='provinsi'
                    value={formData.provinsi}
                    onChange={handleInputChange}
                    placeholder='Provinsi'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'
                  />
                </div>
                <div>
                  <Label
                    htmlFor='kabOrKota'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Jenis Wilayah
                  </Label>
                  <Select
                    value={formData.kabOrKota}
                    onValueChange={(value) =>
                      setFormData((f) => ({ ...f, kabOrKota: value }))
                    }
                    name='kabOrKota'>
                    <SelectTrigger className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'>
                      <SelectValue placeholder='Pilih jenis wilayah' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Kabupaten'>Kabupaten</SelectItem>
                      <SelectItem value='Kota'>Kota</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor='kabKota'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Kabupaten/Kota
                  </Label>
                  <Input
                    id='kabKota'
                    name='kabKota'
                    value={formData.kabKota}
                    onChange={handleInputChange}
                    placeholder='Kabupaten atau Kota'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'
                  />
                </div>
                <div>
                  <Label
                    htmlFor='nama'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Nama Lengkap
                  </Label>
                  <Input
                    id='nama'
                    name='nama'
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder='Masukkan nama avatar Roblox Anda'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'
                  />
                </div>

                <div>
                  <Label
                    htmlFor='nik'
                    className='text-sm font-medium flex justify-between items-center text-gray-700 mb-2'>
                    NIK (16 digit)
                    <span className='text-red-500 text-xs'>
                      Jangan pakai NIK asli*
                    </span>
                  </Label>
                  <div className='flex gap-2'>
                    <Input
                      id='nik'
                      name='nik'
                      value={formData.nik}
                      onChange={handleInputChange}
                      placeholder='1234567890123456'
                      maxLength={16}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'
                    />
                    <button
                      type='button'
                      onClick={handleRandomNik}
                      className='px-3 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all text-xs whitespace-nowrap'>
                      NIK Random
                    </button>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label
                      htmlFor='tempatLahir'
                      className='block text-sm font-medium text-gray-700 mb-2'>
                      Tempat Lahir
                    </Label>
                    <Input
                      id='tempatLahir'
                      name='tempatLahir'
                      value={formData.tempatLahir}
                      onChange={handleInputChange}
                      placeholder='Jakarta'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor='tanggalLahir'
                      className='block text-sm font-medium text-gray-700 mb-2'>
                      Tanggal Lahir
                    </Label>
                    <Input
                      id='tanggalLahir'
                      name='tanggalLahir'
                      type='date'
                      value={formData.tanggalLahir}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor='jenisKelamin'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Jenis Kelamin
                  </Label>
                  <Select
                    value={formData.jenisKelamin}
                    onValueChange={(value) =>
                      setFormData((f) => ({ ...f, jenisKelamin: value }))
                    }
                    name='jenisKelamin'>
                    <SelectTrigger className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'>
                      <SelectValue placeholder='Pilih jenis kelamin' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Laki-laki'>Laki-laki</SelectItem>
                      <SelectItem value='Perempuan'>Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor='alamat'
                    className='text-sm font-medium flex justify-between items-center text-gray-700 mb-2'>
                    Alamat
                    <span className='text-red-500 text-xs'>
                      Jangan pakai alamat asli*
                    </span>
                  </Label>
                  <Textarea
                    id='alamat'
                    name='alamat'
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder='Jl. Roblox No. 123, Kelurahan Gaming, Kecamatan Avatar'
                    rows={3}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label
                      htmlFor='rtRw'
                      className='block text-sm font-medium text-gray-700 mb-2'>
                      RT/RW
                    </Label>
                    <Input
                      id='rtRw'
                      name='rtRw'
                      value={formData.rtRw}
                      onChange={handleInputChange}
                      placeholder='001/002'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor='kelDesa'
                      className='block text-sm font-medium text-gray-700 mb-2'>
                      Kel/Desa
                    </Label>
                    <Input
                      id='kelDesa'
                      name='kelDesa'
                      value={formData.kelDesa}
                      onChange={handleInputChange}
                      placeholder='Kelurahan/Desa'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor='kecamatan'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Kecamatan
                  </Label>
                  <Input
                    id='kecamatan'
                    name='kecamatan'
                    value={formData.kecamatan}
                    onChange={handleInputChange}
                    placeholder='Kecamatan'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label
                      htmlFor='agama'
                      className='block text-sm font-medium text-gray-700 mb-2'>
                      Agama
                    </Label>
                    <Select
                      value={formData.agama}
                      onValueChange={(value) =>
                        setFormData((f) => ({ ...f, agama: value }))
                      }
                      name='agama'>
                      <SelectTrigger className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'>
                        <SelectValue placeholder='Pilih agama' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Islam'>Islam</SelectItem>
                        <SelectItem value='Kristen'>Kristen</SelectItem>
                        <SelectItem value='Katolik'>Katolik</SelectItem>
                        <SelectItem value='Hindu'>Hindu</SelectItem>
                        <SelectItem value='Buddha'>Buddha</SelectItem>
                        <SelectItem value='Konghucu'>Konghucu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor='statusPerkawinan'
                      className='block text-sm font-medium text-gray-700 mb-2'>
                      Status Perkawinan
                    </Label>
                    <Select
                      value={formData.statusPerkawinan}
                      onValueChange={(value) =>
                        setFormData((f) => ({ ...f, statusPerkawinan: value }))
                      }
                      name='statusPerkawinan'>
                      <SelectTrigger className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'>
                        <SelectValue placeholder='Pilih status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Belum Kawin'>Belum Kawin</SelectItem>
                        <SelectItem value='Kawin'>Kawin</SelectItem>
                        <SelectItem value='Cerai Hidup'>Cerai Hidup</SelectItem>
                        <SelectItem value='Cerai Mati'>Cerai Mati</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor='pekerjaan'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Pekerjaan
                  </Label>
                  <Input
                    id='pekerjaan'
                    name='pekerjaan'
                    value={formData.pekerjaan}
                    onChange={handleInputChange}
                    placeholder='Pelajar'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400'
                  />
                </div>
                <label className='w-full mt-6 bg-white border border-red-600 text-red-600 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center cursor-pointer'>
                  📸 Upload Foto Avatar
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarChange}
                    className='hidden'
                  />
                </label>
                <div className='mt-6'>
                  <Label className='block text-sm font-medium text-gray-700 mb-2'>
                    Gambar Tanda Tangan (TTD)
                  </Label>
                  <div className='bg-white border border-blue-600 rounded-lg p-2 flex flex-col items-center'>
                    <SignaturePad
                      ref={sigPadRef}
                      penColor='black'
                      canvasProps={{
                        width: 200,
                        height: 60,
                        className: 'bg-white rounded',
                      }}
                    />
                    <div className='flex gap-2 mt-2'>
                      <button
                        type='button'
                        onClick={() => {
                          const canvas = sigPadRef.current.getCanvas()
                          setTtdUrl(canvas.toDataURL('image/png'))
                        }}
                        className='px-4 py-2 bg-blue-500 text-white rounded'>
                        Simpan TTD
                      </button>
                      <button
                        type='button'
                        onClick={() => {
                          sigPadRef.current?.clear()
                          setTtdUrl(null)
                        }}
                        className='px-4 py-2 bg-gray-400 text-white rounded'>
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className='scroll-animate-right bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-8 text-white sticky top-24'>
              <h3 className='text-2xl font-bold mb-6'>👁️ Preview KTP</h3>

              <div className='flex flex-col items-center'>
                <svg
                  ref={svgRef}
                  width={KTP_DOWNLOAD_WIDTH}
                  height={KTP_DOWNLOAD_HEIGHT}
                  viewBox={`0 0 ${KTP_DOWNLOAD_WIDTH} ${KTP_DOWNLOAD_HEIGHT}`}
                  style={{
                    background: '#fff',
                    borderRadius: 10,
                    boxShadow: '0 2px 8px #0001',
                  }}
                  xmlns='http://www.w3.org/2000/svg'
                  fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                  <defs>
                    <linearGradient id='ktp-bg' x1='0' y1='0' x2='1' y2='1'>
                      <stop offset='0%' stopColor='#b3d8f7' />
                      <stop offset='100%' stopColor='#e0f2fe' />
                    </linearGradient>
                  </defs>
                  <rect
                    x='0'
                    y='0'
                    width={KTP_DOWNLOAD_WIDTH}
                    height={KTP_DOWNLOAD_HEIGHT}
                    rx='10'
                    fill='url(#ktp-bg)'
                    strokeWidth='3'
                  />

                  <text
                    x='50%'
                    y='20'
                    textAnchor='middle'
                    fontWeight='bold'
                    fontSize='14'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    PROVINSI {(formData.provinsi || 'PROVINSI').toUpperCase()}
                  </text>
                  <text
                    x='50%'
                    y='35'
                    textAnchor='middle'
                    fontWeight='bold'
                    fontSize='14'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    {formData.kabOrKota.toUpperCase()}{' '}
                    {formData.kabKota.toUpperCase()}
                  </text>
                  {/* <text
                    x='50%'
                    y='45'
                    textAnchor='middle'
                    fontWeight='bold'
                    fontSize='10'
                    fontFamily='Arial, Helvetica, sans-serif'>
                    PROVINSI JAWA BARAT
                  </text>
                  <text
                    x='50%'
                    y='55'
                    textAnchor='middle'
                    fontWeight='bold'
                    fontSize='10'
                    fontFamily='Arial, Helvetica, sans-serif'>
                    KABUPATEN BANDUNG
                  </text> */}
                  {/* Data */}
                  <text
                    x='13'
                    y='60'
                    fontSize='11'
                    fontWeight='bold'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    NIK
                  </text>
                  <text
                    x='100'
                    y='60'
                    fontSize='11'
                    fontWeight='bold'
                    fill={formData.nik ? '#222' : '#bbb'}
                    fontStyle={formData.nik ? 'normal' : 'italic'}
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    : {(formData.nik || '________________').toUpperCase()}
                  </text>
                  <text
                    x='13'
                    y='80'
                    fontSize='9'
                    fontWeight='bold'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    Nama
                  </text>
                  <text
                    x='100'
                    y='80'
                    fontSize='9'
                    fontWeight='bold'
                    fill={formData.nama ? '#222' : '#bbb'}
                    fontStyle={formData.nama ? 'normal' : 'italic'}
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    : {(formData.nama || '________________').toUpperCase()}
                  </text>
                  <text
                    x='13'
                    y='95'
                    fontSize='9'
                    fontWeight='bold'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    Tempat/Tgl Lahir
                  </text>
                  <text
                    x='100'
                    y='95'
                    fontSize='9'
                    fontWeight='bold'
                    fill={
                      formData.tanggalLahir && formData.tempatLahir
                        ? '#222'
                        : '#bbb'
                    }
                    fontStyle={
                      formData.tanggalLahir && formData.tempatLahir
                        ? 'normal'
                        : 'italic'
                    }
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    : {formData.tempatLahir.toUpperCase()}, {''}
                    {formatTanggal(formData.tanggalLahir).toUpperCase()}
                  </text>

                  <text
                    x='13'
                    y='110'
                    fontSize='9'
                    fontWeight='bold'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    Alamat
                  </text>
                  <text
                    x='100'
                    y='110'
                    fontSize='9'
                    fontWeight='bold'
                    fill={formData.alamat ? '#222' : '#bbb'}
                    fontStyle={formData.alamat ? 'normal' : 'italic'}
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    : {(formData.alamat || '________________').toUpperCase()}
                  </text>
                  <text
                    x='25'
                    y='125'
                    fontSize='9'
                    fontWeight='bold'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    RT/RW
                  </text>
                  <text
                    x='100'
                    y='125'
                    fontSize='9'
                    fontWeight='bold'
                    fill={formData.rtRw ? '#222' : '#bbb'}
                    fontStyle={formData.rtRw ? 'normal' : 'italic'}
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    : {(formData.rtRw || '________________').toUpperCase()}
                  </text>
                  <text
                    x='25'
                    y='135'
                    fontSize='9'
                    fontWeight='bold'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    Kel/Desa
                  </text>
                  <text
                    x='100'
                    y='135'
                    fontSize='9'
                    fontWeight='bold'
                    fill={formData.kelDesa ? '#222' : '#bbb'}
                    fontStyle={formData.kelDesa ? 'normal' : 'italic'}
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    : {(formData.kelDesa || '________________').toUpperCase()}
                  </text>
                  <text
                    x='25'
                    y='145'
                    fontSize='9'
                    fontWeight='bold'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    Kecamatan
                  </text>
                  <text
                    x='100'
                    y='145'
                    fontSize='9'
                    fontWeight='bold'
                    fill={formData.kecamatan ? '#222' : '#bbb'}
                    fontStyle={formData.kecamatan ? 'normal' : 'italic'}
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    : {(formData.kecamatan || '________________').toUpperCase()}
                  </text>
                  <text
                    x='13'
                    y='160'
                    fontSize='9'
                    fontWeight='bold'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    Agama
                  </text>
                  <text
                    x='100'
                    y='160'
                    fontSize='9'
                    fontWeight='bold'
                    fill={formData.agama ? '#222' : '#bbb'}
                    fontStyle={formData.agama ? 'normal' : 'italic'}
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    : {(formData.agama || '________________').toUpperCase()}
                  </text>
                  <text
                    x='13'
                    y='175'
                    fontSize='9'
                    fontWeight='bold'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    Status
                  </text>
                  <text
                    x='100'
                    y='175'
                    fontSize='9'
                    fontWeight='bold'
                    fill={formData.statusPerkawinan ? '#222' : '#bbb'}
                    fontStyle={formData.statusPerkawinan ? 'normal' : 'italic'}
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    :{' '}
                    {(
                      formData.statusPerkawinan || '________________'
                    ).toUpperCase()}
                  </text>
                  <text
                    x='13'
                    y='190'
                    fontSize='9'
                    fontWeight='bold'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    Pekerjaan
                  </text>
                  <text
                    x='100'
                    y='190'
                    fontSize='9'
                    fontWeight='bold'
                    fill={formData.pekerjaan ? '#222' : '#bbb'}
                    fontStyle={formData.pekerjaan ? 'normal' : 'italic'}
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    : {(formData.pekerjaan || '________________').toUpperCase()}
                  </text>
                  <text
                    x='13'
                    y='205'
                    fontSize='9'
                    fontWeight='bold'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    Kewarganegaraan
                  </text>
                  <text
                    x='100'
                    y='205'
                    fontSize='9'
                    fontWeight='bold'
                    fill='#222'
                    fontStyle='normal'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    : WNI
                  </text>
                  <text
                    x='13'
                    y='220'
                    fontWeight='bold'
                    fontSize='9'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    Masa Berlaku
                  </text>
                  <text
                    x='100'
                    y='220'
                    fontWeight='bold'
                    fontSize='9'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif">
                    : SEUMUR HIDUP
                  </text>
                  {/* Avatar */}

                  {avatarUrl && (
                    <image
                      href={avatarUrl}
                      x='260'
                      y='60'
                      width='76'
                      height='99'
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <text
                    x='300'
                    y='170'
                    fontSize='9'
                    fontWeight='bold'
                    textAnchor='middle'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif"
                    fill='#222'>
                    {formData.kabKota.toUpperCase()}
                  </text>
                  <text
                    x='300'
                    y='185'
                    fontSize='9'
                    fontWeight='bold'
                    textAnchor='middle'
                    fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif"
                    fill='#222'>
                    {getToday()}
                  </text>
                  {ttdUrl ? (
                    <image
                      href={ttdUrl}
                      x='270'
                      y='195'
                      width='60'
                      textAnchor='middle'
                      height='25'
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <text
                      x='290'
                      y='185'
                      fontSize='8'
                      fontWeight='bold'
                      fontFamily="Arial, 'Arial Narrow', Calibri, Helvetica, sans-serif"
                      fill='#888'
                      textAnchor='middle'>
                      TTD
                    </text>
                  )}
                </svg>
                <button
                  className='mt-4 bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition-all'
                  onClick={handleDownloadSVG}>
                  Download KTP (SVG/PNG)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='fitur' className='py-24 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='scroll-animate text-4xl lg:text-5xl font-bold text-gray-900 mb-6'>
              Mengapa Pilih Generator Kami?
            </h2>
            <p className='scroll-animate text-xl text-gray-600 max-w-3xl mx-auto'>
              Fitur-fitur unggulan yang membuat KTP Roblox Anda terlihat
              profesional dan autentik
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='scroll-animate text-center p-8 rounded-2xl bg-white hover:shadow-xl transition-all transform hover:-translate-y-2'>
              <div className='w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-white text-2xl'>🎨</span>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                Desain Autentik
              </h3>
              <p className='text-gray-600'>
                Template KTP yang mirip dengan aslinya, lengkap dengan format
                dan tata letak yang profesional
              </p>
            </div>

            <div className='scroll-animate text-center p-8 rounded-2xl bg-white hover:shadow-xl transition-all transform hover:-translate-y-2'>
              <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-white text-2xl'>⚡</span>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                Mudah & Cepat
              </h3>
              <p className='text-gray-600'>
                Proses pembuatan yang simpel, cukup isi form dan langsung jadi!
                Tidak perlu keahlian desain
              </p>
            </div>

            <div className='scroll-animate text-center p-8 rounded-2xl bg-white hover:shadow-xl transition-all transform hover:-translate-y-2'>
              <div className='w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-white text-2xl'>💎</span>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                100% Gratis
              </h3>
              <p className='text-gray-600'>
                Layanan sepenuhnya gratis tanpa watermark atau batasan. Download
                langsung dalam kualitas tinggi
              </p>
            </div>
            <div className='scroll-animate text-center p-8 rounded-2xl bg-white hover:shadow-xl transition-all transform hover:-translate-y-2'>
              <div className='w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-white text-2xl'>🛡️</span>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                100% Data Aman
              </h3>
              <p className='text-gray-600'>
                Data yang Anda masukkan tidak disimpan di server ataupun
                database dan hanya digunakan untuk pembuatan KTP Roblox.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorial Section */}
      <section
        id='tutorial'
        className='py-24 bg-gradient-to-r from-blue-900 to-teal-900'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='scroll-animate text-4xl lg:text-5xl font-bold text-white mb-8'>
              Cara Membuat KTP Roblox
            </h2>
            <p className='scroll-animate text-xl text-gray-300 max-w-3xl mx-auto'>
              Ikuti langkah mudah berikut untuk membuat KTP Roblox yang keren
              untuk avatar Anda!
            </p>
          </div>

          <div className='grid md:grid-cols-4 gap-8'>
            <div className='scroll-animate text-center'>
              <div className='w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 hover:scale-110'>
                <span className='text-white text-2xl font-bold'>1</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-4'>Isi Data</h3>
              <p className='text-gray-300'>
                Lengkapi semua field pada form generator dengan data avatar
                Roblox Anda
              </p>
            </div>

            <div className='scroll-animate text-center'>
              <div className='w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 hover:scale-110'>
                <span className='text-white text-2xl font-bold'>2</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-4'>Upload Foto</h3>
              <p className='text-gray-300'>
                Upload screenshot avatar Roblox Anda untuk foto pada KTP
              </p>
            </div>

            <div className='scroll-animate text-center'>
              <div className='w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 hover:scale-110'>
                <span className='text-white text-2xl font-bold'>3</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-4'>Preview</h3>
              <p className='text-gray-300'>
                Cek preview KTP Anda dan pastikan semua data sudah benar
              </p>
            </div>

            <div className='scroll-animate text-center'>
              <div className='w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 hover:scale-110'>
                <span className='text-white text-2xl font-bold'>4</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-4'>Download</h3>
              <p className='text-gray-300'>
                Klik tombol download dan KTP Roblox Anda siap digunakan!
              </p>
            </div>
          </div>

          <div className='text-center mt-12'>
            <button
              onClick={() => scrollToSection('generator')}
              className='scroll-animate bg-gradient-to-r from-green-400 to-blue-500 text-white px-12 py-6 rounded-full font-bold text-xl hover:from-green-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-2xl'>
              🚀 Mulai Buat KTP Sekarang!
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-12'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div className='scroll-animate'>
              <div className='flex items-center space-x-2 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold'>📋</span>
                </div>
                <span className='font-bold text-lg'>KTP Roblox Generator</span>
              </div>
              <p className='text-gray-400'>
                Generator KTP Roblox terbaik untuk membuat identitas unik avatar
                Anda.
              </p>
            </div>
            <div className='scroll-animate'>
              <h4 className='font-bold mb-4'>Fitur</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <button
                    onClick={() => scrollToSection('generator')}
                    className='hover:text-white transition-colors'>
                    Generator KTP
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('fitur')}
                    className='hover:text-white transition-colors'>
                    Fitur Unggulan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('tutorial')}
                    className='hover:text-white transition-colors'>
                    Tutorial
                  </button>
                </li>
              </ul>
            </div>
            <div className='scroll-animate'>
              <h4 className='font-bold mb-4'>Bantuan</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>📧 help@ktproblox.com</li>
                <li>💬 FAQ</li>
                <li>📖 Panduan Lengkap</li>
              </ul>
            </div>
            <div className='scroll-animate'>
              <h4 className='font-bold mb-4'>Lainnya</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>🔒 Privasi</li>
                <li>📋 Syarat & Ketentuan</li>
                <li>⭐ Rating & Review</li>
              </ul>
            </div>
          </div>
          <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
            <p>&copy; 2024 KTP Roblox Generator. Semua hak cipta dilindungi.</p>
            <p className='text-sm mt-2'>
              ⚠️ Untuk keperluan hiburan dan gaming saja. Bukan dokumen resmi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
