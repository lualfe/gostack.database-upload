// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

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
      // TODO
    }
    const transactionsRepository = getRepository(Transaction);
    const categoriesRepository = getRepository(Category);

    let fullCategory = await categoriesRepository.findOne({
      where: { title: category },
    });
    if (!fullCategory) {
      fullCategory = await categoriesRepository.save({ title: category });
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      category_id: fullCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
