import { Category } from "../shared/category.model"
import { CategoryService } from "../shared/category.service"
import { BaseResourceListComponent } from 'src/app/shared/components/base-resource-list/base-resource-list.component';
import { Component } from '@angular/core';
 
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent extends BaseResourceListComponent<Category> {

  constructor(categoryService: CategoryService){
    super(categoryService);
  }
}
