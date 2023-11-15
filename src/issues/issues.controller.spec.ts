import { Test, TestingModule } from '@nestjs/testing';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';

describe('IssuesController', () => {
  let controller: IssuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssuesController],
      providers: [IssuesService],
    }).compile();

    controller = module.get<IssuesController>(IssuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("should return an list of issues", () => {
    expect(Array.isArray(controller.findAll)).toBeTruthy()
  })
});
