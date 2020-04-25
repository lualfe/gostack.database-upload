// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const transactionExists = transactionsRepository.findOne({ where: id });
    if (!transactionExists) {
      // TODO
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
