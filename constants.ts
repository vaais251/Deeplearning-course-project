import { Lesson, ContentType } from './types';

// Curriculum designed to take a student from scalar values to reproducing GPT-2, 
// interleaving Computer Vision concepts (Justin Johnson) where they fit architecturally (before WaveNet).
export const CURRICULUM: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Micrograd: Backprop on Scalars',
    description: 'The absolute foundation. Building Micrograd: A tiny scalar-valued autograd engine and a neural net on top of it.',
    type: ContentType.VIDEO,
    url: 'VMj-3S1tku0',
    thumbnail: 'https://i.ytimg.com/vi/VMj-3S1tku0/hqdefault.jpg',
    duration: '2h 25m',
    tags: ['Backpropagation', 'Micrograd', 'Python']
  },
  {
    id: 'blog-1',
    title: 'Yes you should understand backprop',
    description: 'A crucial essay on why understanding the leaky abstractions of backpropagation is vital for debugging.',
    type: ContentType.BLOG,
    url: 'https://karpathy.medium.com/yes-you-should-understand-backprop-e2f06eab496b',
    thumbnail: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*5J64R_rX7hF8c4YhWz_5EQ.png',
    duration: '15m read',
    tags: ['Theory', 'Best Practices']
  },
  {
    id: 'lesson-2',
    title: 'Makemore 1: Bigram Models',
    description: 'Introduction to language modeling. Building a bigram character-level language model from scratch.',
    type: ContentType.VIDEO,
    url: 'PaCmpygFfXo',
    thumbnail: 'https://i.ytimg.com/vi/PaCmpygFfXo/hqdefault.jpg',
    duration: '1h 56m',
    tags: ['NLP', 'Bigram', 'Probability']
  },
  {
    id: 'lesson-3',
    title: 'Makemore 2: MLP & Activations',
    description: 'Building a Multi-Layer Perceptron (MLP) following the Bengio et al. 2003 paper.',
    type: ContentType.VIDEO,
    url: 'TCH_1BHY58I',
    thumbnail: 'https://i.ytimg.com/vi/TCH_1BHY58I/hqdefault.jpg',
    duration: '1h 15m',
    tags: ['MLP', 'Embeddings']
  },
  {
    id: 'lesson-4',
    title: 'Makemore 3: Batch Normalization',
    description: 'Deep dive into initialization, batch normalization, and the internal mechanics of training stability.',
    type: ContentType.VIDEO,
    url: 'P6sfmUTpUmc',
    thumbnail: 'https://i.ytimg.com/vi/P6sfmUTpUmc/hqdefault.jpg',
    duration: '1h 42m',
    tags: ['Optimization', 'BatchNorm']
  },
  {
    id: 'lesson-5',
    title: 'Makemore 4: Backpropagation Ninja',
    description: 'Manually implementing backpropagation for the whole MLP stack. Hardcore mode.',
    type: ContentType.VIDEO,
    url: 'q8SA3rM6ckI',
    thumbnail: 'https://i.ytimg.com/vi/q8SA3rM6ckI/hqdefault.jpg',
    duration: '2h 06m',
    tags: ['Calculus', 'Implementation']
  },
  // INTERMISSION: Computer Vision (Justin Johnson)
  // Essential before WaveNet because WaveNet uses Dilated Convolutions
  {
    id: 'lesson-cv-1',
    title: 'Foundations of Computer Vision',
    description: 'Lecture 1 from Justin Johnson (UMich EECS 498). A high-level overview of the history and goals of Computer Vision.',
    type: ContentType.VIDEO,
    url: 'NfnWJUyUJYU', 
    thumbnail: 'https://i.ytimg.com/vi/NfnWJUyUJYU/hqdefault.jpg',
    duration: '1h 16m',
    tags: ['CV', 'History', 'Intro']
  },
  {
    id: 'lesson-cv-2',
    title: 'Convolutional Neural Networks',
    description: 'Deep dive into the convolution operation, pooling, and spatial arrangement. Essential prereq for advanced architectures.',
    type: ContentType.VIDEO,
    url: 'dJYGatp4SvA',
    thumbnail: 'https://i.ytimg.com/vi/dJYGatp4SvA/hqdefault.jpg',
    duration: '1h 22m',
    tags: ['CV', 'CNN', 'Kernels']
  },
  {
    id: 'lesson-cv-3',
    title: 'CNN Architectures (AlexNet to ResNet)',
    description: 'Case studies of famous architectures: AlexNet, VGG, GoogLeNet, and the residual connections of ResNet.',
    type: ContentType.VIDEO,
    url: 'pSH7_6hK970',
    thumbnail: 'https://i.ytimg.com/vi/pSH7_6hK970/hqdefault.jpg',
    duration: '1h 15m',
    tags: ['ResNet', 'VGG', 'Architecture']
  },
  // Back to Karpathy
  {
    id: 'lesson-6',
    title: 'Makemore 5: WaveNet',
    description: 'Building a WaveNet architecture. We apply dilated convolutions (learned in the previous CV section) to text generation.',
    type: ContentType.VIDEO,
    url: 't3YJ5hKiMQ0',
    thumbnail: 'https://i.ytimg.com/vi/t3YJ5hKiMQ0/hqdefault.jpg',
    duration: '1h 53m',
    tags: ['WaveNet', 'Convolutions', 'Dilated']
  },
  {
    id: 'blog-2',
    title: 'The Unreasonable Effectiveness of RNNs',
    description: 'The legendary blog post that sparked excitement about text generation before the Transformer era.',
    type: ContentType.BLOG,
    url: 'http://karpathy.github.io/2015/05/21/rnn-effectiveness/',
    thumbnail: 'https://karpathy.github.io/assets/rnn/diags.jpeg',
    duration: '20m read',
    tags: ['RNN', 'LSTM', 'History']
  },
  {
    id: 'lesson-7',
    title: 'Building GPT: From scratch',
    description: 'The culmination: Building a Generatively Pre-trained Transformer (GPT) from scratch in code.',
    type: ContentType.VIDEO,
    url: 'kCc8FmEb1nY',
    thumbnail: 'https://i.ytimg.com/vi/kCc8FmEb1nY/hqdefault.jpg',
    duration: '1h 56m',
    tags: ['GPT', 'Attention', 'Transformers']
  },
  {
    id: 'lesson-8',
    title: 'Let\'s build the GPT Tokenizer',
    description: 'Understanding BPE (Byte Pair Encoding), Unicode, and how text becomes numbers for the LLM.',
    type: ContentType.VIDEO,
    url: 'zduSFxRajkE',
    thumbnail: 'https://i.ytimg.com/vi/zduSFxRajkE/hqdefault.jpg',
    duration: '2h 13m',
    tags: ['Tokenizer', 'Unicode', 'BPE']
  },
  {
    id: 'lesson-9',
    title: 'Let\'s reproduce GPT-2 (124M)',
    description: 'Scaling up! Reproducing the GPT-2 (124M) model training run. The modern era of LLMs.',
    type: ContentType.VIDEO,
    url: 'l8pRSuU81PU',
    thumbnail: 'https://i.ytimg.com/vi/l8pRSuU81PU/hqdefault.jpg',
    duration: '4h 02m',
    tags: ['LLM', 'Training', 'Scale']
  }
];