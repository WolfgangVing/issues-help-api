import { Test, TestingModule } from '@nestjs/testing';
import { IssuesService } from './issues.service';
import { IssuesRepository } from './issues.repository';

describe('IssuesService', () => {
  let service: IssuesService;
  let repository: IssuesRepository;
  let createdIssue = {

  }
  let dataToCreateIssue = {
    
  }

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

  describe("createIssue", () => {
    it("should create and return a issue", async() => {
      const result = createdIssue;
    })
  })
});
