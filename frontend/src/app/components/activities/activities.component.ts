import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControlOptions, } from '@angular/forms';
import { ActivitiesService, Category } from 'src/app/services/activities.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent {
  mainCategories!: Array<{name: String, id: String}>;
  categories!: Category[];
  selectedCategories: String[] = [];
  canBeAssigned: Boolean = false;

  constructor(private fb: FormBuilder, private actService : ActivitiesService) {
    this.actService.getMainCategories().subscribe(categories =>{
      this.mainCategories = categories;
    } 
    );

    this.actService.getCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  activityForm = this.fb.group(
    {
      name: ["activity1", Validators.required],
      maxPoints: [1, Validators.compose([Validators.required, Validators.min(1)])],
      category: this.fb.array([
        this.fb.group({
          name: ["", Validators.required, this.canBeAssigned]
        })
      ]),
      deadline: [""],
    }
  );

  onSubmit() {
    const categoryName = this.selectedCategories[this.selectedCategories.length - 1];
    const categoryID = this.categories.find(cat => cat.name == categoryName)?._id;
    const data = {
      name: this.activityForm.value.name,
      max_points: this.activityForm.value.maxPoints, 
      deadline: this.activityForm.value.deadline,
      categoryID: categoryID
    }
    this.actService.addActivity(data);
  }

  getFormCategories(): FormArray {
    return this.activityForm.get("category") as FormArray;
  }

  getSubCategories(name: String) {
    const subCategoriesIds = this.categories
      .filter(category => {
        return category.name === name;
      })
      .map(category => {
        return category.sub_categories;
      })
      .flat();
    
    return this.categories.filter(cat => {
      return subCategoriesIds.includes(cat._id);
    })
    .map(cat => {
      return cat.name;
    })
  }

  setCanBeAssigned(i: number) {
    const last_cat = this.categories
    .find(cat => cat.name === this.selectedCategories[i]);
    if (!last_cat){
      this.canBeAssigned = false;
      return;
    }
    this.canBeAssigned = last_cat.sub_categories.length == 0;
  }

  handleCategorySelection(event: any, i: number){
    let selectedCategoryName = event.target.value;
    this.selectedCategories[i] = selectedCategoryName;
    this.clearTrailingCategories(i);
    this.setCanBeAssigned(i);
    this.addCategory(selectedCategoryName);
    
    
  }

  addCategory(name: string) {
    const newGroup = this.fb.group({
      name: ["", Validators.required]
    });
    newGroup.setValidators([Validators.required]);
    if (!this.canBeAssigned && this.selectedCategories[0] !== "") this.getFormCategories().push(newGroup);
  }

  clearTrailingCategories(i: number) {
    while (this.selectedCategories.length > i+1){
      this.selectedCategories.pop();
    }
    while (this.getFormCategories().controls.length > i+1){
      this.getFormCategories().removeAt(i+1);
    }
    return;
  }

}
