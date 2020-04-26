import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (
      title === '' ||
      value <= 0 ||
      (type !== 'income' && type !== 'outcome') ||
      category === ''
    ) {
      throw new AppError('title, value, type and category are all required');
    }
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const allTransactions = await transactionsRepository.find();
    const { total } = await transactionsRepository.getBalance(allTransactions);

    if (type === 'outcome' && total - value < 0) {
      throw new AppError('account balance cannot go below zero');
    }

    let fullCategory = await categoriesRepository.findOne({
      where: { title: category },
    });
    if (!fullCategory) {
      fullCategory = await categoriesRepository.save({ title: category });
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: fullCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
