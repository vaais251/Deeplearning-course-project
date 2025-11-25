import { Lesson, ContentType } from './types';

// Curriculum designed to take a student from scalar values to reproducing GPT-2, 
// interleaving Computer Vision concepts (Justin Johnson) where they fit architecturally (before WaveNet).
export const CURRICULUM: Lesson[] = [
  {
    id: 'blog-0',
    title: 'Hacker\'s Guide to Neural Networks',
    description: 'The legendary introductory post. "We will write a Neural Network in Python. We will not use any Deep Learning libraries." The perfect precursor.',
    type: ContentType.BLOG,
    url: 'https://karpathy.github.io/neuralnets/',
    thumbnail: 'https://karpathy.github.io/assets/neuralnets/circuit.png',
    duration: '25m read',
    tags: ['Intro', 'Python', 'Circuit']
  },
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
    id: 'blog-misconceptions',
    title: 'Common Misconceptions about Neural Networks',
    description: 'An early but timeless post addressing common errors in training, data preprocessing, and architecture selection.',
    type: ContentType.BLOG,
    url: 'https://karpathy.github.io/2014/07/03/common-misconceptions-about-neural-networks/',
    thumbnail: 'https://karpathy.github.io/assets/neuralnets/network.png', 
    duration: '15m read',
    tags: ['Theory', 'Debugging', 'Best Practices']
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
  {
    id: 'blog-3',
    title: 'Software 2.0',
    description: 'Neural networks are not just another classifier, they represent the beginning of a fundamental shift in how we write software.',
    type: ContentType.BLOG,
    url: 'https://karpathy.medium.com/software-2-0-a64152b37c35',
    thumbnail: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4b3N3tD6Bv_F6fT2tM3vEg.png',
    duration: '10m read',
    tags: ['Philosophy', 'Software Engineering']
  },
  // INTERMISSION: Computer Vision (Justin Johnson)
  {
    id: 'lesson-cv-1',
    title: 'Foundations of Computer Vision',
    description: 'Lecture 1 from Justin Johnson (UMich). A high-level overview of the history and goals of Computer Vision.',
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
  {
    id: 'lesson-cv-4',
    title: 'Hardware & Software',
    description: 'Justin Johnson (UMich). GPUs vs TPUs, mixed precision, and the practical difference between eager (PyTorch) and static (TF) execution.',
    type: ContentType.VIDEO,
    url: 'hgX587hA1Q4',
    thumbnail: 'https://i.ytimg.com/vi/hgX587hA1Q4/hqdefault.jpg',
    duration: '1h 20m',
    tags: ['GPU', 'PyTorch', 'Hardware']
  },
  {
    id: 'lesson-cv-5',
    title: 'Training Neural Networks',
    description: 'Justin Johnson (UMich). Practical tips: Activation functions, weight initialization, learning rate schedules, and transfer learning.',
    type: ContentType.VIDEO,
    url: 'wEoyxE0GP2M',
    thumbnail: 'https://i.ytimg.com/vi/wEoyxE0GP2M/hqdefault.jpg',
    duration: '1h 18m',
    tags: ['Training', 'Hyperparameters', 'Practical']
  },
  {
    id: 'blog-cv-extra',
    title: 'Competing against a ConvNet on ImageNet',
    description: 'A fascinating experiment where Karpathy manually classified ImageNet images to benchmark human performance against state-of-the-art CNNs.',
    type: ContentType.BLOG,
    url: 'https://karpathy.github.io/2014/09/02/what-i-learned-from-competing-against-a-convnet-on-imagenet/',
    thumbnail: 'https://karpathy.github.io/assets/imagenet/screen.jpeg',
    duration: '20m read',
    tags: ['CV', 'ImageNet', 'Human Benchmark']
  },
  {
    id: 'blog-rl-1',
    title: 'Deep Reinforcement Learning: Pong from Pixels',
    description: 'A classic. We build a Policy Gradient agent from scratch to play Pong. Essential for understanding modern RLHF.',
    type: ContentType.BLOG,
    url: 'https://karpathy.github.io/2016/05/31/rl/',
    thumbnail: 'https://karpathy.github.io/assets/rl/pong.gif',
    duration: '30m read',
    tags: ['RL', 'Policy Gradient', 'Pong']
  },
  {
    id: 'blog-rl-2',
    title: 'AlphaGo, in context',
    description: 'An accessible explanation of how AlphaGo works, mixing Policy Gradients with Monte Carlo Tree Search (MCTS).',
    type: ContentType.BLOG,
    url: 'https://karpathy.github.io/2016/03/09/alphago/',
    thumbnail: 'https://karpathy.github.io/assets/alphago/mcts.png',
    duration: '25m read',
    tags: ['RL', 'AlphaGo', 'MCTS']
  },
  
  // Back to Sequence Modeling
  {
    id: 'lesson-rnn-jj',
    title: 'Recurrent Neural Networks (RNN/LSTM)',
    description: 'Justin Johnson (UMich). A structured introduction to RNNs, Backprop through time, LSTMs, and Image Captioning.',
    type: ContentType.VIDEO,
    url: 'yCC09vCHzF8',
    thumbnail: 'https://i.ytimg.com/vi/yCC09vCHzF8/hqdefault.jpg',
    duration: '1h 25m',
    tags: ['RNN', 'LSTM', 'Theory']
  },
  {
    id: 'blog-2',
    title: 'The Unreasonable Effectiveness of RNNs',
    description: 'The legendary blog post that sparked excitement about text generation before the Transformer era.',
    type: ContentType.BLOG,
    url: 'https://karpathy.github.io/2015/05/21/rnn-effectiveness/',
    thumbnail: 'https://karpathy.github.io/assets/rnn/diags.jpeg',
    duration: '20m read',
    tags: ['RNN', 'LSTM', 'History']
  },
  {
    id: 'lesson-6',
    title: 'Makemore 5: WaveNet',
    description: 'Building a WaveNet architecture. We apply dilated convolutions (learned in the CV section) to text generation.',
    type: ContentType.VIDEO,
    url: 't3YJ5hKiMQ0',
    thumbnail: 'https://i.ytimg.com/vi/t3YJ5hKiMQ0/hqdefault.jpg',
    duration: '1h 53m',
    tags: ['WaveNet', 'Convolutions', 'Dilated']
  },
  {
    id: 'lesson-attn-jj',
    title: 'Attention and Transformers',
    description: 'Justin Johnson (UMich). The conceptual leap from RNNs to Attention mechanisms and the full Transformer architecture.',
    type: ContentType.VIDEO,
    url: 'YAgJfCMR9zo',
    thumbnail: 'https://i.ytimg.com/vi/YAgJfCMR9zo/hqdefault.jpg',
    duration: '1h 28m',
    tags: ['Attention', 'Transformers', 'Theory']
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
    id: 'blog-4',
    title: 'A Recipe for Training Neural Networks',
    description: 'Practical advice on training NNs. "The first step is to inspect your data." A must-read for practitioners.',
    type: ContentType.BLOG,
    url: 'https://karpathy.github.io/2019/04/25/recipe/',
    thumbnail: 'https://i.imgur.com/Jv3v3kM.png', 
    duration: '25m read',
    tags: ['Practical', 'Debugging', 'Training']
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