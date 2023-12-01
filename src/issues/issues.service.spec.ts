import { Test, TestingModule } from '@nestjs/testing';
import { IssuesService } from './issues.service';
import { IssuesRepository } from './issues.repository';

describe('IssuesService', () => {
  let service: IssuesService;
  let repository: IssuesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IssuesService, IssuesRepository],
    }).compile();

    service = module.get<IssuesService>(IssuesService);
    repository = module.get<IssuesRepository>(IssuesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
