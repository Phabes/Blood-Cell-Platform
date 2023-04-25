import { Component } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Category } from "src/app/models/category";
import { ActivitiesService } from "src/app/services/activities.service";

@Component({
  selector: "app-activities",
  templateUrl: "./activities.component.html",
  styleUrls: ["./activities.component.css"],
})
export class ActivitiesComponent {
  mainCategories!: Array<{ name: string; id: string }>;
  categories!: Category[];
  selectedCategories: string[] = [];
  canBeAssigned = false;
  wasActivityCorrectlyAdded : boolean | null = null;

  constructor(private fb: FormBuilder, private actService: ActivitiesService) {
    this.actService.getMainCategories().subscribe((categories) => {
      this.mainCategories = categories;
    });

    this.actService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  activityForm = this.fb.group({
    name: ["activity1", Validators.required],
    maxPoints: [
      1,
      Validators.compose([Validators.required, Validators.min(1)]),
    ],
    category: this.fb.array([
      this.fb.group({
        name: ["", Validators.required, this.canBeAssigned],
      }),
    ]),
    deadline: [""],
  });

  ngOnInit() {
    this.wasActivityCorrectlyAdded = null;
  }

  async onSubmit() {
    const categoryName =
      this.selectedCategories[this.selectedCategories.length - 1];
    const categoryID = this.categories.find(
      (cat) => cat.name == categoryName
    )?._id;
    const data = {
      name: this.activityForm.value.name,
      max_points: this.activityForm.value.maxPoints,
      deadline: this.activityForm.value.deadline,
      categoryID: categoryID,
    };
    const result = await this.actService.addActivity(data);
    
    if (result === "ACTIVITY CORRECTLY ASSIGNED") this.wasActivityCorrectlyAdded = true;
    else this.wasActivityCorrectlyAdded = false;
  }

  getFormCategories(): FormArray {
    return this.activityForm.get("category") as FormArray;
  }

  getSubCategories(name: string) {
    const subCategoriesIds = this.categories
      .filter((category) => {
        return category.name === name;
      })
      .map((category) => {
        return category.sub_categories;
      })
      .flat();

    return this.categories
      .filter((cat) => {
        return subCategoriesIds.includes(cat._id);
      })
      .map((cat) => {
        return cat.name;
      });
  }

  setCanBeAssigned(i: number) {
    const last_cat = this.categories.find(
      (cat) => cat.name === this.selectedCategories[i]
    );
    if (!last_cat) {
      this.canBeAssigned = false;
      return;
    }
    this.canBeAssigned = last_cat.sub_categories.length == 0;
  }

  handleCategorySelection(event: any, i: number) {
    const selectedCategoryName = event.target.value;
    this.selectedCategories[i] = selectedCategoryName;
    this.clearTrailingCategories(i);
    this.setCanBeAssigned(i);
    this.addCategory(selectedCategoryName);
  }

  addCategory(name: string) {
    const newGroup = this.fb.group({
      name: ["", Validators.required],
    });
    newGroup.setValidators([Validators.required]);
    if (!this.canBeAssigned && this.selectedCategories[0] !== "")
      this.getFormCategories().push(newGroup);
  }

  clearTrailingCategories(i: number) {
    while (this.selectedCategories.length > i + 1) {
      this.selectedCategories.pop();
    }
    while (this.getFormCategories().controls.length > i + 1) {
      this.getFormCategories().removeAt(i + 1);
    }
    return;
  }
}
