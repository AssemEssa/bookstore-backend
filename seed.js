import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';
import User from './models/User.js';

dotenv.config();

const books = [
  // YOU CAN EDIT THIS SECTION
  // Replace with your own books, descriptions, and image URLs
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "Between life and death there is a library. When Nora Seed finds herself in the Midnight Library, she has a chance to make things right. Up until now, her life has been full of misery and regret. She feels she has let everyone down, including herself. But things are about to change.",
    price: 24.99,
    originalPrice: 29.99,
    category: "Fiction",
    isbn: "9780525559474",
    publisher: "Viking",
    pages: 304,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    stock: 50,
    rating: 4.8,
    numReviews: 1245,
    featured: true,
    bestseller: true,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    price: 19.99,
    originalPrice: 27.99,
    category: "Self-Help",
    isbn: "9780735211292",
    publisher: "Avery",
    pages: 320,
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop",
    stock: 100,
    rating: 4.9,
    numReviews: 3421,
    featured: true,
    bestseller: true,
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it.",
    price: 22.99,
    originalPrice: 28.99,
    category: "Sci-Fi",
    isbn: "9780593135204",
    publisher: "Ballantine Books",
    pages: 496,
    coverImage: "https://images.unsplash.com/photo-1614544048536-0d28caf77f41?w=300&h=450&fit=crop",
    stock: 75,
    rating: 4.7,
    numReviews: 892,
    featured: true,
    bestseller: false,
  },
  {
    title: "The Thursday Murder Club",
    author: "Richard Osman",
    description: "In a peaceful retirement village, four unlikely friends meet weekly in the Jollly Good Fellows Club to discuss unsolved killings. But when a local developer is found dead with a mysterious photograph left next to the body, the Thursday Murder Club suddenly find themselves in the middle of their first live case.",
    price: 16.99,
    originalPrice: 26.99,
    category: "Mystery",
    isbn: "9781984880987",
    publisher: "Pamela Dorman Books",
    pages: 368,
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
    stock: 60,
    rating: 4.6,
    numReviews: 567,
    featured: false,
    bestseller: true,
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange, a drug capable of extending life and enhancing consciousness.",
    price: 18.99,
    originalPrice: 18.99,
    category: "Sci-Fi",
    isbn: "9780441172719",
    publisher: "Ace",
    pages: 688,
    coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=450&fit=crop",
    stock: 80,
    rating: 4.9,
    numReviews: 2341,
    featured: true,
    bestseller: true,
  },
  {
    title: "Educated",
    author: "Tara Westover",
    description: "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure the children received an education, and no one to intervene when one of Tara's older brothers became violent.",
    price: 17.99,
    originalPrice: 28.99,
    category: "Biography",
    isbn: "9780399590504",
    publisher: "Random House",
    pages: 334,
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop",
    stock: 45,
    rating: 4.8,
    numReviews: 1567,
    featured: false,
    bestseller: true,
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.",
    price: 15.99,
    originalPrice: 26.99,
    category: "Thriller",
    isbn: "9781250301697",
    publisher: "Celadon Books",
    pages: 336,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
    stock: 90,
    rating: 4.5,
    numReviews: 2109,
    featured: true,
    bestseller: true,
  },
  {
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    description: "For years, rumors of the 'Marsh Girl' have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl.",
    price: 19.99,
    originalPrice: 28.99,
    category: "Fiction",
    isbn: "9780735219090",
    publisher: "G.P. Putnam's Sons",
    pages: 384,
    coverImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=450&fit=crop",
    stock: 70,
    rating: 4.7,
    numReviews: 3456,
    featured: true,
    bestseller: true,
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description: "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. Money—investing, personal finance, and business decisions—is typically taught as a math-based field, where data and formulas tell us exactly what to do.",
    price: 21.99,
    originalPrice: 24.99,
    category: "Business",
    isbn: "9780857197689",
    publisher: "Harriman House",
    pages: 256,
    coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=450&fit=crop",
    stock: 55,
    rating: 4.8,
    numReviews: 987,
    featured: false,
    bestseller: true,
  },
  {
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    description: "Told in Kvothe's own voice, this is the tale of the magically gifted young man who grows to be the most notorious wizard his world has ever seen. A high-action story written with a poet's hand, The Name of the Wind is a masterpiece that will transport readers into the body and mind of a wizard.",
    price: 20.99,
    originalPrice: 29.99,
    category: "Fantasy",
    isbn: "9780756404079",
    publisher: "DAW Books",
    pages: 662,
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=450&fit=crop",
    stock: 65,
    rating: 4.9,
    numReviews: 2876,
    featured: true,
    bestseller: true,
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution—a #1 international bestseller—that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be 'human.'",
    price: 23.99,
    originalPrice: 35.99,
    category: "History",
    isbn: "9780062316097",
    publisher: "Harper",
    pages: 443,
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop",
    stock: 85,
    rating: 4.7,
    numReviews: 4521,
    featured: true,
    bestseller: true,
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep one day to whisk him away on an adventure.",
    price: 14.99,
    originalPrice: 14.99,
    category: "Fantasy",
    isbn: "9780547928227",
    publisher: "Mariner Books",
    pages: 300,
    coverImage: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=450&fit=crop",
    stock: 120,
    rating: 4.9,
    numReviews: 8765,
    featured: false,
    bestseller: true,
  },
];

const users = [
  {
    name: "Admin User",
    email: "admin@bookstore.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "customer",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data
    await Book.deleteMany();
    await User.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create users individually to trigger password hashing middleware
    for (const userData of users) {
      await User.create(userData);
    }
    console.log('👤 Users created');

    await Book.insertMany(books);
    console.log('📚 Books created');

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Admin credentials:');
    console.log('   Email: admin@bookstore.com');
    console.log('   Password: admin123');
    console.log('\n📝 Test user credentials:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
