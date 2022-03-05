  <template>
    <div>
        <b-modal
            id="create-target-modal"
            title="Create Attendance Target"
            ref="create-modal"
            @ok="handleOk"
            :okVariant="'info'"
            :okTitle="'Create'"
        >
            <b-form
                ref="createTargetForm"
                @submit.stop.prevent="handleSubmit"
            >
                <b-form-group
                    label="Module"
                    label-for="module-input"
                    invalid-feedback="Module is required"
                    :state="isModuleValid"
                >
                    <b-form-select
                        id="module-input"
                        v-model="createModal.module"
                        :options="options"
                    >
                    </b-form-select>
                </b-form-group>

                <b-form-group
                    label="Attendance Target"
                    label-for="target-input"
                    invalid-feedback="Target is required. Must be between 50 and 100%"
                >
                    <b-form-input
                        type="number"
                        step="1"
                        id="target-input"
                        v-model="createModal.target"
                        :state="isTargetValid"
                    ></b-form-input>
                </b-form-group>

            </b-form>
        </b-modal>
    </div>
</template>

<script>
import { api } from "../middleware/helpers/api";
import { notify } from "../middleware/helpers/utilities";
/**
 * Component to show the create modal.
 */
export default {
    name: "create-modal",

    computed: {
        /**
         * Check if cost meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isTargetValid() {
            if (this.createModal.target) {
                return this.validTarget();
            }
            return false;
        },

        /**
         * Check if type meets constraints.
         * @return {Boolean} Whether the condition is true.
         */
        isModuleValid() {
            if (this.createModal.module) {
                return this.validModule();
            }
            return false;
        },

        /**
         * Check if the form passes all validation.
         * @return {Boolean} Whether the condition is true.
         */
        isFormValid() {
            return this.isTargetValid && this.isModuleValid;
        },
    },

    data() {
        return {
            // The mapped form data.
            createModal: {},

            options: [],
        };
    },

    methods: {
        /**
         * Show the modal on the page.
         */
        openCreateModal(targets) {
            targets.forEach((module) => {
                this.options.push(module.name);
            });
            this.targets = targets;
            this.$refs["create-modal"].show();
        },

        /**
         * On modal submit, check if validation passes.
         */
        handleOk(event) {
            if (this.isFormValid) {
                this.createTarget();
            } else {
                event.preventDefault();
            }
        },

        /**
         * Check if cost follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validTarget() {
            return this.createModal.target >= 50 &&
                this.createModal.target <= 100
                ? true
                : false;
        },

        /**
         * Check if module follows validation rules.
         * @returns {Boolean} Whether the condition is met
         */
        validModule() {
            return this.options.includes(this.createModal.module);
        },

        createTarget() {
            let module;

            this.targets.forEach((moduleTarget) => {
                if (moduleTarget.name == this.createModal.module) {
                    module = moduleTarget;
                }
            });

            let to_update = {
                ModuleId: module.Module_User.ModuleId,
                UserId: module.Module_User.UserId,
                target: this.createModal.target,
            };
            api.updateModuleUser(to_update)
                .then(() => {
                    this.$emit("refreshModules");
                    notify(
                        this,
                        "Successfully updated target.",
                        "darkenSuccess"
                    );
                })
                .catch(() => {
                    notify(this, "Failed to update targets.", "darkenError");
                });
        },
    },
};
</script>


