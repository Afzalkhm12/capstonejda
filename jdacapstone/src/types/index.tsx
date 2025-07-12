export interface Product {
  id: number
  name: string
  price: number
  description: string
  category: string
  image: string
  inStock: boolean
  impact: string
}

export interface StatisticCard {
  title: string
  value: string
  description: string
  icon: string
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
}

export interface ContactForm {
  name: string
  email: string
  message: string
}